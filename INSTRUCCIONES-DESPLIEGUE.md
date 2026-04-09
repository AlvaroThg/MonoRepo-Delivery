# Guía de Despliegue - Satélite Delivery
## Instrucciones Paso a Paso: Docker Compose y Kubernetes

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Despliegue Local con Docker Compose](#despliegue-local-con-docker-compose)
3. [Despliegue en Kubernetes](#despliegue-en-kubernetes)
4. [Validación y Testing](#validación-y-testing)
5. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### Software Necesario

```bash
# Verificar que tienes Docker instalado
docker --version
# Deberías ver: Docker version 20.10.x o superior

# Verificar que tienes Docker Compose
docker-compose --version
# Deberías ver: Docker Compose version 2.x.x o superior

# Verificar kubectl (solo para Kubernetes)
kubectl version --client
# Deberías ver: Client Version: v1.24.0 o superior
```

### Hardware Mínimo Requerido

- **RAM**: 4 GB mínimo
- **Disco**: 10 GB libres
- **CPU**: 2 núcleos mínimo

### Comprobación de Espacio

```bash
# En Windows PowerShell
Get-Volume | Where-Object {$_.DriveLetter -eq 'D'}

# En Mac/Linux
df -h /
```

---

# DESPLIEGUE LOCAL CON DOCKER COMPOSE

## Paso 1: Preparar el Repositorio

### 1.1 Clonar o Navegar al Proyecto

```bash
# Si aún no tienen el proyecto
cd D:\Proyectos Propios\MonoRepo-Delivery

# O clonarlo
git clone https://github.com/tu-usuario/MonoRepo-Delivery.git
cd MonoRepo-Delivery
```

### 1.2 Verificar la Estructura de Carpetas

```bash
# En PowerShell, verificar que existen estos archivos
Get-Item docker-compose.yml
Get-Item Satelite-Delivery
Get-Item Satelite-Delivery-App
Get-Item kub

# Resultado esperado: Deberías ver las 4 líneas sin errores
```

### 1.3 Entender la Estructura

```
MonoRepo-Delivery/
├── docker-compose.yml          # Orquestación de contenedores
├── Satelite-Delivery/          # Backend Laravel
│   ├── Dockerfile
│   ├── Dockerfile.nginx
│   ├── nginx/
│   │   └── default.conf
│   ├── .env                    # Configuración del backend
│   └── ... (código Laravel)
├── Satelite-Delivery-App/      # Frontend Expo/React Native
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (código de la app)
└── kub/                         # Manifiestos Kubernetes
    ├── configmap.yaml
    ├── secret.yaml
    ├── persistentvolumeclaim.yaml
    ├── deployment.yaml
    └── service.yaml
```

**¿Por qué esta estructura?**
- **Monorepo**: Todo el código en un lugar, fácil de mantener
- **Dockerfiles**: Cada servicio tiene su propio Dockerfile optimizado
- **kub/**: Listos para escalar cuando sea necesario

---

---

## Paso 2: Construir las Imágenes Docker

### 2.1 Construcción Individual de Imágenes

**IMPORTANTE**: Construir las imágenes en este orden para aprovechar el cache de capas.

#### Construir Imagen del Frontend

```bash
# Cambiar al directorio del frontend
cd Satelite-Delivery-App

# Construir la imagen del frontend
docker build -t satelite-delivery-frontend:v1.0 .

# Verificar que se creó
docker images | findstr frontend

# Resultado esperado:
# satelite-delivery-frontend    v1.0    xxxxxxxx    26.2MB
```

**¿Qué hace este Dockerfile?**
```dockerfile
# Multi-stage build: Node.js para exportar web → Nginx para servir
FROM node:20-alpine AS builder  # IMPORTANTE: Usar Node 20+ para Expo
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx expo export --platform web --output-dir dist

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Construir Imagen del Backend PHP-FPM

```bash
# Cambiar al directorio del backend
cd ../Satelite-Delivery

# Construir la imagen del backend PHP
docker build -t satelite-delivery-backend-php:v1.0 .

# Verificar que se creó
docker images | findstr backend-php

# Resultado esperado:
# satelite-delivery-backend-php    v1.0    xxxxxxxx    ~50MB
```

**¿Qué hace este Dockerfile?**
```dockerfile
# PHP-FPM con extensiones PostgreSQL
FROM php:8.4-rc-fpm-alpine  # IMPORTANTE: Usar PHP 8.4+ para Symfony 8
RUN apk add --no-cache postgresql-dev libpq \
    && docker-php-ext-install pdo pdo_pgsql pgsql
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction
COPY . .
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache
EXPOSE 9000
CMD ["php-fpm"]
```

#### Construir Imagen del Backend Nginx

```bash
# Construir la imagen del nginx reverse proxy
docker build -f Dockerfile.nginx -t satelite-delivery-backend-nginx:v1.0 .

# Verificar que se creó
docker images | findstr backend-nginx

# Resultado esperado:
# satelite-delivery-backend-nginx    v1.0    xxxxxxxx    26MB
```

**¿Qué hace este Dockerfile?**
```dockerfile
# Nginx reverse proxy para Laravel
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY public /var/www/html/public
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Verificar Imagen de PostgreSQL

```bash
# PostgreSQL ya está disponible como imagen oficial
docker pull postgres:16-alpine

# Verificar que existe
docker images | findstr postgres

# Resultado esperado:
# postgres    16-alpine    xxxxxxxx    111MB
```

### 2.2 Construcción Masiva con Docker Compose

```bash
# Volver a la raíz del proyecto
cd ..

# Construir TODAS las imágenes de una vez
docker-compose build

# O construir sin cache (más lento pero más confiable)
docker-compose build --no-cache

# Ver todas las imágenes satelite creadas
docker images | findstr satelite

# Resultado esperado:
# satelite-delivery-frontend        v1.0    xxxxxxxx    26.2MB
# satelite-delivery-backend-php     v1.0    xxxxxxxx    ~50MB
# satelite-delivery-backend-nginx   v1.0    xxxxxxxx    26MB
# postgres                         16-alpine xxxxxxxx   111MB
```

**¿Qué hace docker-compose build?**
- Lee el `docker-compose.yml`
- Para cada servicio con `build:`, ejecuta `docker build`
- Etiqueta las imágenes automáticamente
- Reutiliza capas de cache cuando es posible

### 2.3 Verificar que las Imágenes se Construyeron Correctamente

```bash
# Listar todas las imágenes relacionadas con satelite
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Deberías ver estas 4 imágenes:
# REPOSITORY                        TAG       SIZE
# satelite-delivery-frontend        v1.0      26.2MB
# satelite-delivery-backend-php     v1.0      50.1MB
# satelite-delivery-backend-nginx   v1.0      26MB
# postgres                          16-alpine 111MB

# Ver detalles de una imagen específica
docker inspect satelite-delivery-frontend:v1.0 | findstr "Size"

# Ver las capas de una imagen
docker history satelite-delivery-frontend:v1.0
```

**Explicación de los tamaños:**
- **Frontend**: ~26MB (Nginx Alpine + archivos estáticos)
- **Backend PHP**: ~50MB (PHP Alpine + Composer + Laravel)
- **Backend Nginx**: ~26MB (Nginx Alpine + config)
- **PostgreSQL**: ~111MB (PostgreSQL Alpine + datos base)

**Total**: ~213MB (muy optimizado comparado con imágenes tradicionales)

### 2.4 Troubleshooting de Construcción

#### Problema: "Node.js is outdated and unsupported"

```bash
# Error típico:
# Node.js (v18.20.8) is outdated and unsupported. Please update to a newer Node.js LTS version

# Solución: Cambiar a Node 20 en el Dockerfile
# Asegúrate de que el Dockerfile tenga:
FROM node:20-alpine AS builder

# Si el error persiste, reconstruir sin cache
docker build --no-cache -t satelite-delivery-frontend:v1.0 .
```

#### Problema: "Build fails en expo export"

```bash
# Verificar que tienes Node.js instalado localmente
node --version
npm --version

# Si falla, probar export manual primero
cd Satelite-Delivery-App
npx expo export --platform web --output-dir dist

# Si eso funciona, el Dockerfile debería funcionar
```

#### Problema: "Composer install falla"

```bash
# Verificar conexión a internet
ping google.com

# Si falla por memoria, agregar swap o usar máquina con más RAM
# O modificar Dockerfile para usar --no-scripts
```

#### Problema: "Composer install fails - Could not open input file: artisan"

```bash
# Error típico:
# Could not open input file: artisan
# Script @php artisan package:discover --ansi handling the post-autoload-dump event returned with error code 1

# Solución: Usar --no-scripts en composer install
# El Dockerfile debe ejecutar:
RUN composer install --no-scripts --optimize-autoloader --no-dev --no-interaction

# Explicación:
# - Composer intenta ejecutar scripts de post-instalación
# - Pero artisan.php no existe aún (se copia después)
# - --no-scripts evita que ejecute estos scripts durante la instalación
```

#### Problema: "Composer install fails - requires php >=8.4"

```bash
# Error típico:
# symfony/clock v8.0.8 requires php >=8.4 -> your php version (8.3.30) does not satisfy that requirement

# Solución: Usar PHP 8.4 RC en el Dockerfile
# Asegúrate de que el Dockerfile tenga:
FROM php:8.4-rc-fpm-alpine

# Si no funciona, alternativa: actualizar composer.lock
# En el host (fuera de Docker):
composer update

# O cambiar a Laravel 10 que es compatible con PHP 8.2
# Pero recomendamos usar PHP 8.4 RC para compatibilidad futura
```

#### Problema: "No space left on device"

```bash
# Limpiar imágenes no utilizadas
docker system prune -a

# Verificar espacio en disco
Get-PSDrive C | Select-Object Used,Free

# Liberar espacio si es necesario
```

---

## Paso 3: Levantar los Contenedores

## Paso 3: Levantar los Contenedores

### 3.1 Iniciar Docker Compose

```bash
# Asegúrate de estar en la raíz del proyecto
cd D:\Proyectos Propios\MonoRepo-Delivery

# Levantar todos los servicios en segundo plano
docker-compose up -d

# Ver el progreso en tiempo real (opcional)
docker-compose up
# Presiona Ctrl+C para detener sin matar los contenedores
```

**¿Qué hace este comando?**
1. Crea la red personalizada `satelite-network`
2. Crea el volumen `postgres-data` para persistencia
3. Inicia los 4 contenedores en orden correcto (gracias a `depends_on`)

### 3.2 Esperar a que los Servicios Estén Listos

```bash
# Esperar ~30 segundos mientras se inicializan
# Algunos servicios necesitan tiempo para iniciar

# Ver el estado de todos los contenedores
docker-compose ps

# Deberías ver algo como:
# NAME                    STATUS              PORTS
# satelite-delivery-frontend    Up 30 seconds   0.0.0.0:80->80/tcp
# satelite-delivery-db          Up 45 seconds   0.0.0.0:5432->5432/tcp
# satelite-delivery-backend-php Up 35 seconds   (sin puerto expuesto)
# satelite-delivery-backend-nginx Up 32 seconds 0.0.0.0:8080->80/tcp
```

---

## Paso 4: Verificar que Todo Está Funcionando

### 4.1 Probar el Frontend Web

```bash
# Abrir en el navegador
http://localhost

# O desde PowerShell
start http://localhost

# Deberías ver la aplicación web de Satélite Delivery
```

### 4.2 Probar el Backend API

```bash
# Desde PowerShell, hacer una solicitud
curl.exe http://localhost:8080/up

# O instalando curl si no lo tienes
# Resultado esperado: Debe regresar "OK" o estado 200
```

### 4.3 Probar la Base de Datos

```bash
# Conectarse a PostgreSQL
docker-compose exec db psql -U postgres -d satelite_delivery -c "SELECT now();"

# Deberías ver la fecha y hora actual (confirmación de conexión)
```

**¿Qué significa?**
- **Frontend (80)**: Nginx sirviendo la app web
- **Backend (8080)**: Nginx con reverse proxy a PHP-FPM
- **DB (5432)**: PostgreSQL escuchando conexiones

### 4.4 Ejecutar Migraciones de Base de Datos

```bash
# Ver los logs del backend para verificar que Laravel está funcionando
docker-compose logs backend-php

# Ejecutar migraciones (esto crea las tablas)
docker-compose exec backend-php php artisan migrate

# Resultado esperado: "Migration table created successfully" o "Nothing to migrate"
```

---

## Paso 5: Validación Completa de Docker Compose

### 5.1 Verificar Conectividad Interna Entre Contenedores

```bash
# Verificar que backend-php puede conectarse a DB

# En PowerShell:
$code = '@"
$link = pg_connect("host=db port=5432 user=postgres password=secret dbname=satelite_delivery");
if ($link) {
    echo "Conexión a DB exitosa\n";
} else {
    echo "Error de conexión\n";
}
"@
docker-compose exec backend-php php -r $code

# O más simple: acceder a shell y ejecutar directamente
docker-compose exec backend-php php -r "echo 'PHP is running'; var_dump(pg_connect('host=db port=5432 user=postgres password=secret dbname=satelite_delivery'));"
```

### 5.2 Verificar la Red Personalizada

```bash
# Inspeccionar la red
docker network ls | findstr satelite

# Ver detalles de la red
docker network inspect MonoRepo-Delivery_satelite-network

# Deberías ver los 4 contenedores conectados a la red
```

### 5.3 Verificar Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Deberías ver: MonoRepo-Delivery_postgres-data

# Inspeccionar para ver dónde está el almacenamiento
docker volume inspect MonoRepo-Delivery_postgres-data

# Resultado: Ruta local donde se guardan los datos de PostgreSQL
```

**¿Por qué es importante?**
- Los volúmenes garantizan que si reinician Docker, **los datos persisten**
- Esto es crítico para una base de datos

---

## Paso 6: Trabajar con Docker Compose

### 6.1 Ver Logs de un Servicio

```bash
# Logs del backend PHP
docker-compose logs backend-php

# Logs en tiempo real del frontend
docker-compose logs -f frontend

# Últimas 50 líneas de todos los servicios
docker-compose logs --tail=50

# Salir del modo seguimiento: Ctrl+C
```

### 6.2 Ejecutar Comandos Inside Contenedores

```bash
# Acceder a shell de backend-php
docker-compose exec backend-php sh

# Dentro del contenedor, ejecutar comandos artisan
php artisan tinker
php artisan db:seed
exit  # Para salir

# Ejecutar comando sin entrar en shell
docker-compose exec backend-php php artisan config:cache
```

### 6.3 Detener y Reanudar

```bash
# Pausar todos los servicios (sin eliminar)
docker-compose pause

# Reanudar
docker-compose unpause

# Detener completamente
docker-compose stop

# Reanudar desde detención
docker-compose start

# Reiniciar un servicio específico
docker-compose restart backend-php
```

### 6.4 Limpiar Todo

```bash
# Detener y eliminar contenedores, pero mantener volúmenes y imágenes
docker-compose down

# Detener y eliminar todo (incluyendo volúmenes - datos se pierden!)
docker-compose down -v

# Eliminar también las imágenes
docker-compose down -v --rmi all
```

---

## 🎯 Resumen: Docker Compose Funcionando

```bash
# Checklist de confirmación:
✓ Imágenes construidas (docker images)
✓ Todos los contenedores corriendo (docker-compose ps)
✓ Frontend accesible en http://localhost
✓ Backend API respondiendo en http://localhost:8080/up
✓ Base de datos conectada (docker-compose exec db psql...)
✓ Datos persistidos en volumen
✓ Red personalizada conectando contenedores
✓ Migraciones ejecutadas correctamente
```

---

---

# DESPLIEGUE EN KUBERNETES

## Paso 1: Preparar el Clúster de Kubernetes

### 1.1 Verificar que Kubernetes está Disponible

```bash
# Verificar estado del clúster
kubectl cluster-info

# Deberías ver:
# Kubernetes master is running at https://127.0.0.1:xxxxx
# CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

# Ver nodos disponibles
kubectl get nodes

# Deberías ver al menos 1 nodo (si usas Docker Desktop, será "docker-desktop")
```

### 1.2 Habilitar Kubernetes en Docker Desktop (si no está habilitado)

**Si kubectl no funciona, habilita Kubernetes en Docker Desktop:**

1. Abre **Docker Desktop**
2. Ve a **Settings** → **Kubernetes**
3. Marca "Enable Kubernetes"
4. Haz clic en "Apply & Restart"
5. Espera a que inicie (puede tomar 2-3 minutos)
6. Verifica: `kubectl get nodes` (debe mostrar "docker-desktop" o similar)

**Alternativa: Si prefieres Minikube en lugar de Docker Desktop:**

```bash
# Descargar Minikube desde: https://minikube.sigs.k8s.io/docs/start/
# O instalar con Chocolatey (Windows):
choco install minikube

# Iniciar Minikube:
minikube start

# Después, todos los comandos kubectl funcionarán igual
```

### 1.3 Entender Kubernetes vs Docker Compose

| Aspecto | Docker Compose | Kubernetes |
|--------|----------------|------------|
| **Uso** | Desarrollo local | Producción |
| **Escala** | 1 máquina | Múltiples máquinas |
| **Persistencia** | Volúmenes locales | Volúmenes de red/cloud |
| **Config** | docker-compose.yml | YAML manifests en kub/ |
| **Orquestación** | Básica | Avanzada (auto-scaling, auto-healing) |

---

## Paso 2: Preparar las Imágenes para Kubernetes

### 2.1 Hacer las Imágenes Disponibles para Kubernetes

**Opción A: Usar Docker Desktop Kubernetes (Recomendado - Local)**

```bash
# Si estás usando Docker Desktop, las imágenes que construiste en Docker Compose
# están AUTOMÁTICAMENTE disponibles en Kubernetes

# Simplemente verifica que las imágenes existen:
docker images | findstr satelite

# Resultado esperado:
# satelite-delivery-frontend        v1.0    xxxxxxxx    26.2MB
# satelite-delivery-backend-php     v1.0    xxxxxxxx    ~50MB
# satelite-delivery-backend-nginx   v1.0    xxxxxxxx    26MB

# ¡Listo! Kubernetes en Docker Desktop puede acceder a estas imágenes
# Pasa directamente a Paso 3: Desplegar Manifiestos
```

**Opción B: Usar Docker Hub (Para Cualquier Clúster Remoto)**

```bash
# Hacer login en Docker Hub
docker login

# Taggear y subir cada imagen
cd D:\Proyectos Propios\MonoRepo-Delivery

# Frontend
cd Satelite-Delivery-App
docker build -t satelite-delivery-frontend:v1.0 .
docker tag satelite-delivery-frontend:v1.0 tuusuario/satelite-delivery-frontend:v1.0
docker push tuusuario/satelite-delivery-frontend:v1.0
cd ..

# Backend PHP
cd Satelite-Delivery
docker build -t satelite-delivery-backend-php:v1.0 .
docker tag satelite-delivery-backend-php:v1.0 tuusuario/satelite-delivery-backend-php:v1.0
docker push tuusuario/satelite-delivery-backend-php:v1.0

# Backend Nginx
docker build -f Dockerfile.nginx -t satelite-delivery-backend-nginx:v1.0 .
docker tag satelite-delivery-backend-nginx:v1.0 tuusuario/satelite-delivery-backend-nginx:v1.0
docker push tuusuario/satelite-delivery-backend-nginx:v1.0
cd ..

# Verificar que se subieron
docker images | findstr tuusuario

# PostgreSQL no necesita push (imagen oficial)
```

**¿Cuál opción usar?**
- **Minikube**: Más rápido para desarrollo local
- **Docker Hub**: Necesario para clústeres remotos o producción

### 2.2 Actualizar Manifiestos si Cambias los Nombres de Imagen

Si usas Docker Hub, actualiza los manifiestos de Kubernetes:

```bash
# Editar el deployment.yaml para usar tus imágenes
notepad kub/deployment.yaml

# Cambiar estas líneas:
# image: satelite-delivery-frontend:v1.0
# Por:
# image: tuusuario/satelite-delivery-frontend:v1.0

# Repetir para las demás imágenes
```

### 2.3 Verificar Disponibilidad de Imágenes

```bash
# Para Minikube
eval $(minikube docker-env)
docker images | findstr satelite

# Para Docker Hub (desde cualquier lugar)
docker pull tuusuario/satelite-delivery-frontend:v1.0
docker images | findstr tuusuario
```

**¿Por qué esto?**
- Docker Compose usa imágenes locales automáticamente
- Kubernetes necesita acceso a las imágenes (local, Docker Hub, etc.)
- Minikube tiene su propio Docker servidor

---

## Paso 3: Desplegar Manifiestos en Kubernetes

### 3.1 Estructura de Directorios

```bash
# Verificar que los manifiestos existen
Get-Item D:\Proyectos Propios\MonoRepo-Delivery\kub\

# Deberías ver:
# configmap.yaml
# secret.yaml
# persistentvolumeclaim.yaml
# deployment.yaml
# service.yaml
```

### 3.2 Aplicar Configuraciones (EN ORDEN)

**IMPORTANTE**: El orden es crítico. Aplicar en este orden:

```bash
# Cambiar a la carpeta k8s
cd D:\Proyectos Propios\MonoRepo-Delivery

# PASO 1: ConfigMap (variables no sensibles)
kubectl apply -f kub/configmap.yaml
# Confirmación: configmap/satelite-delivery-config created

# PASO 2: Secret (credenciales)
kubectl apply -f kub/secret.yaml
# Confirmación: secret/satelite-delivery-secret created

# PASO 3: PersistentVolumeClaim (almacenamiento para BD)
kubectl apply -f kub/persistentvolumeclaim.yaml
# Confirmación: persistentvolumeclaim/postgres-pvc created

# PASO 4: Deployments (los contenedores)
kubectl apply -f kub/deployment.yaml
# Confirmación: 4+ created

# PASO 5: Services (acceso a los pods)
kubectl apply -f kub/service.yaml
# Confirmación: 4 created
```

**¿Qué hace cada uno?**

1. **ConfigMap**: Variables como DB_HOST, APP_ENV (no sensibles)
2. **Secret**: Contraseñas y keys (base64 encoded, no visible)
3. **PersistentVolumeClaim**: "Reserva" almacenamiento para BD
4. **Deployment**: Especifica cuántas réplicas de cada servicio
5. **Service**: Crea rutas de acceso a los pods

---

## Paso 4: Verificar el Despliegue

### 4.1 Verificar que los Pods Están Corriendo

```bash
# Ver todos los pods
kubectl get pods

# Deberías ver algo como:
# NAME                                      READY   STATUS    RESTARTS
# frontend-deployment-xxxxx                 1/1     Running   0
# backend-php-deployment-xxxxx              1/1     Running   0
# backend-nginx-deployment-xxxxx            1/1     Running   0
# postgres-deployment-xxxxx                 1/1     Running   0

# Ver más detalles
kubectl get pods -o wide

# Ver descripción de un pod específico (útil para troubleshooting)
kubectl describe pod frontend-deployment-xxxxx

# Ver logs de un pod
kubectl logs deployment/backend-php-deployment

# Ver logs en tiempo real
kubectl logs -f deployment/backend-nginx-deployment
```

### 4.2 Verificar que los Servicios están Accesibles

```bash
# Listar todos los servicios
kubectl get services

# Deberías ver:
# frontend-service          NodePort   10.x.x.x   <none>        80:30080/TCP
# backend-nginx-service     NodePort   10.x.x.x   <none>        80:30081/TCP
# backend-php-service       ClusterIP  10.x.x.x   <none>        9000/TCP
# db-service                ClusterIP  10.x.x.x   <none>        5432/TCP

# Ver más detalles de un servicio
kubectl get service frontend-service -o wide
```

### 4.3 Obtener URLs de Acceso

```bash
# Para Docker Desktop Kubernetes
# Las URLs directas (localhost:30080, localhost:30081) podrían no funcionar en algunos casos
# En su lugar, usa Port-Forward:

# Terminal 1: Exponer Frontend
kubectl port-forward svc/frontend-service 8080:80

# Terminal 2: Exponer Backend API  
kubectl port-forward svc/backend-nginx-service 8081:80

# Luego acceder a:
# Frontend: http://localhost:8080
# Backend:  http://localhost:8081/up

# O si prefieres NodePort (puede no funcionar en Docker Desktop):
# Frontend: http://localhost:30080
# Backend:  http://localhost:30081/api
```

### 4.4 Verificar PersistentVolumes

```bash
# Ver claims de volumen
kubectl get pvc

# Deberías ver:
# postgres-pvc           Bound    pvc-xxxxx   5Gi    RWO

# Ver volúmenes físicos
kubectl get pv

# Descripción detallada
kubectl describe pvc postgres-pvc
```

---

## Paso 5: Validación Completa de Kubernetes

### 5.1 Verificar Conectividad de Pods

```bash
# Acceder a un pod (entrar en shell)
kubectl exec -it deployment/backend-php-deployment -- /bin/sh

# Dentro del pod, probar conexión a BD
apk add postgresql-client  # Instalar cliente PostgreSQL

pg_isready -h db-service -U postgres
# Resultado: accepting connections

# Salir
exit
```

### 5.2 Verificar ConfigMap y Secrets

```bash
# Ver valores del ConfigMap
kubectl get configmap satelite-delivery-config -o yaml

# Ver (sin valores) del Secret (por seguridad)
kubectl get secret satelite-delivery-secret

# Ver el Secret completamente (base64, no plain text)
kubectl get secret satelite-delivery-secret -o yaml

# Decodificar un valor (ejemplo)
echo "c2VjcmV0" | base64 -d
# Resultado: secret
```

### 5.3 Ejecutar Migraciones de BD

```bash
# Ejecutar comando en el pod de PHP
kubectl exec -it deployment/backend-php-deployment -- php artisan migrate

# Resultado esperado:
# Migration table created successfully
# o
# Nothing to migrate
```

### 5.4 Verificar Réplicas (Escalabilidad)

```bash
# Ver replicas actuales
kubectl get deployment

# Deberías ver READY: 1/1 para todos

# Escalar un deployment (crear más réplicas)
kubectl scale deployment frontend-deployment --replicas=3

# Verificar
kubectl get pods
# Ahora deberías ver 3 pods del frontend

# Volver a 1
kubectl scale deployment frontend-deployment --replicas=1
```

---

## Paso 6: Trabajar con Kubernetes

### 6.1 Ver Logs

```bash
# Logs de un pod específico
kubectl logs deployment/backend-nginx-deployment

# Logs en tiempo real
kubectl logs -f deployment/postgres-deployment

# Últimas 50 líneas
kubectl logs --tail=50 deployment/backend-php-deployment

# Salir: Ctrl+C
```

### 6.2 Ejecutar Comandos en Pods

```bash
# Ejecutar comando sin entrar en shell
kubectl exec deployment/backend-php-deployment -- php artisan config:cache

# Entrar en shell interactivo
kubectl exec -it deployment/backend-php-deployment -- /bin/sh

# En Kubernetes, usualmente "/bin/sh" porque las imágenes son Alpine
```

### 6.3 Abrir Puerto Forwarding (Acceso Directo)

```bash
# Redirigir puerto local a pod interno
kubectl port-forward deployment/postgres-deployment 5432:5432

# Luego, en otra terminal:
# psql -h localhost -U postgres -d satelite_delivery

# Salir: Ctrl+C
```

### 6.4 Describir Recursos

```bash
# Descripción detallada de un pod
kubectl describe pod frontend-deployment-xxxxx

# Descripción de un deployment
kubectl describe deployment backend-php-deployment

# Ver eventos recientes
kubectl get events --sort-by='.lastTimestamp'
```

---

## Paso 7: Actualizar Despliegue

### 7.1 Cambiar Imagen

```bash
# Supongamos que hiciste cambios y creaste v1.1
docker build -t satelite-delivery-backend-php:v1.1 ./Satelite-Delivery
docker push tuusuario/satelite-delivery-backend-php:v1.1

# Actualizar en Kubernetes
kubectl set image deployment/backend-php-deployment \
  backend-php=tuusuario/satelite-delivery-backend-php:v1.1

# Ver el progreso del update
kubectl rollout status deployment/backend-php-deployment

# Ver historial de despliegues
kubectl rollout history deployment/backend-php-deployment

# Revertir a versión anterior si algo falla
kubectl rollout undo deployment/backend-php-deployment
```

### 7.2 Cambiar ConfigMap

```bash
# Editar ConfigMap
kubectl edit configmap satelite-delivery-config

# Los pods no se reinician automáticamente, hacerlo manualmente
kubectl rollout restart deployment/backend-php-deployment
```

---

## Paso 8: Limpiar Kubernetes

### 8.1 Eliminar Despliegue

```bash
# Eliminar todo (en orden inverso, opcional pero buena práctica)
kubectl delete -f kub/service.yaml
kubectl delete -f kub/deployment.yaml
kubectl delete -f kub/persistentvolumeclaim.yaml
kubectl delete -f kub/secret.yaml
kubectl delete -f kub/configmap.yaml

# O todo de una vez
kubectl delete -f kub/

# Verificar que se eliminó todo
kubectl get pods
# Deberías ver: "No resources found"
```

### 8.2 Verificar Limpieza

```bash
# Ver si quedan recursos huérfanos
kubectl get all

# Ver volúmenes persistentes
kubectl get pvc
```

---

## 🎯 Resumen: Kubernetes Funcionando

```bash
# Checklist de confirmación:
✓ Clúster Kubernetes accesible (kubectl cluster-info)
✓ Imágenes disponibles (Minikube o Docker Hub)
✓ ConfigMap creado (kubectl get configmap)
✓ Secret creado (kubectl get secret)
✓ PVC creado (kubectl get pvc)
✓ Todos los pods corriendo (kubectl get pods)
✓ Todos los servicios creados (kubectl get services)
✓ Frontend accesible en localhost:30080
✓ Backend API accesible en localhost:30081/api
✓ Conexión a BD funcionando
✓ Migraciones ejecutadas
```

---

# VALIDACIÓN Y TESTING

## Comparación: Docker Compose vs Kubernetes

| Prueba | Docker Compose | Kubernetes |
|---------|----------------|-----------|
| **Construcción** | `docker-compose build` | Imágenes pre-construidas |
| **Inicio** | `docker-compose up -d` | `kubectl apply -f` |
| **Estado** | `docker-compose ps` | `kubectl get pods` |
| **Logs** | `docker-compose logs` | `kubectl logs` |
| **Comandos** | `docker-compose exec` | `kubectl exec` |
| **Parada** | `docker-compose down` | `kubectl delete -f` |

## Checklist de Validación

### APIs y Conectividad

```bash
# 1. Frontend (debe cargar página web)
curl.exe http://localhost/        # Compose
curl.exe http://localhost:30080/  # Kubernetes

# 2. Backend Health (debe retornar OK)
curl.exe http://localhost:8080/up        # Compose
curl.exe http://localhost:30081/up       # Kubernetes

# 3. Base de datos (debe conectar)
# Compose:
docker-compose exec db psql -U postgres -d satelite_delivery

# Kubernetes:
kubectl exec -it deployment/postgres-deployment -- psql -U postgres -d satelite_delivery

# 4. Verificar tabla de usuarios
SELECT * FROM users LIMIT 5;
```

### Performance

```bash
# Verificar uso de recursos en Kubernetes
kubectl top pods

# Verificar uso en Docker Compose
docker stats
```

---

# TROUBLESHOOTING

## Docker Compose

### Problema: "Contenedores en estado Exited"

```bash
# Ver el problema
docker-compose ps

# Ver logs detallados
docker-compose logs nombreserv

# Solución común: Esperar más tiempo
docker-compose down
docker-compose up -d
# Esperar 60 segundos

# Ver logs nuevamente
docker-compose logs
```

### Problema: "Puerto en uso"

```bash
# Encontrar qué está usando el puerto 80
netstat -ano | findstr :80

# Matar el proceso (PID = Process ID)
taskkill /PID 1234 /F

# O cambiar puerto en docker-compose.yml
# Cambiar "80:80" a "8000:80"
```

### Problema: "No puede conectar a BD"

```bash
# Verificar que db está corriendo
docker-compose ps db

# Ejecutar migración
docker-compose exec backend-php php artisan migrate

# Ver logs de BD
docker-compose logs db
```

## Kubernetes

### Problema: "Pods en CrashLoopBackOff"

```bash
# Ver el problema
kubectl describe pod nombrepad

# Ver logs
kubectl logs deployment/nombredeployment

# Soluciones comunes:
# 1. Imagen no existe
# 2. Falta ConfigMap/Secret
# 3. Conexión a BD falla
```

### Problema: "ImagePullBackOff"

```bash
# Significa que la imagen no puede ser descargada
# Soluciones:

# 1. Verificar que registraste la imagen en Docker Hub
docker images | findstr satelite

# 2. Hacer push a Docker Hub si no lo hiciste
docker push tuusuario/satelite-delivery-frontend:v1.0

# 3. Verificar que el nombre de imagen es correcto en deployment.yaml
kubectl get deployment -o yaml | findstr image

# 4. Si usas Minikube, asegúrate de estar en el Docker de Minikube
eval $(minikube docker-env)
docker images
```

### Problema: "Pod no puede conectar a BD"

```bash
# Verificar que el nombre del servicio es correcto
# Debería ser: db-service (no localhost ni 127.0.0.1)

# Ver ConfigMap
kubectl get configmap satelite-delivery-config -o yaml
# Debe tener: DB_HOST: db-service

# Probar conectividad entre pods
kubectl exec -it deployment/backend-php-deployment -- ping db-service
# Debe retornar: 64 bytes

# Si no resuelve el nombre, esperar más tiempo o reiniciar
kubectl rollout restart deployment/backend-php-deployment
```

---

## Tips Finales

### 1. Documentar tu Despliegue

```bash
# Crear un archivo de comandos que funciona para ti
# deployment-commands.sh (o .ps1 en PowerShell)

# Docker Compose
docker-compose build
docker-compose up -d
docker-compose exec backend-php php artisan migrate
echo "Acceso: http://localhost"

# Kubernetes
kubectl apply -f kub/configmap.yaml
kubectl apply -f kub/secret.yaml
# ... (resto de manifiestos)
echo "Acceso: http://localhost:30080"
```

### 2. Preguntas que Debes Poder Responder

- **¿Por qué usamos imágenes Alpine?** → Menor tamaño, más seguras, más rápidas
- **¿Qué es ConfigMap vs Secret?** → ConfigMap para variables públicas, Secret para credenciales
- **¿Por qué necesitamos PVC?** → Para que datos persistan aunque se eliminen pods
- **¿Qué diferencia hay entre Docker Compose y Kubernetes?** → Compose es simple (local), K8s es robusto (producción)
- **¿Cuándo deberías usar Kubernetes?** → Cuando necesitas escalar a múltiples máquinas

### 3. Escalabilidad

```bash
# En Kubernetes, agregar más réplicas es trivial:
kubectl scale deployment frontend-deployment --replicas=5

# En Docker Compose, necesitarías múltiples máquinas

# Por eso Kubernetes es mejor para producción
```

---

## 📚 Recursos Adicionales

- **Documentación Docker Compose**: https://docs.docker.com/compose/
- **Documentación Kubernetes**: https://kubernetes.io/docs/
- **Minikube**: https://minikube.sists.io/docs/
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

**¡Listo para defender tu solución!** 🚀

Ahora tienes:
1. ✅ Instrucciones paso a paso para Docker Compose
2. ✅ Instrucciones paso a paso para Kubernetes
3. ✅ Validación y testing
4. ✅ Troubleshooting
5. ✅ Preguntas típicas que te pueden hacer

Practicá estos pasos varias veces para que entiendas bien el flujo completo.