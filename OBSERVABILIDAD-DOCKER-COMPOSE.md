# Observabilidad con Docker Compose

Este repositorio ahora incluye observabilidad básica para el backend Laravel con:

- Endpoint `http://localhost:8080/metrics`
- Prometheus en `http://localhost:9090`
- Grafana en `http://localhost:3000`
- Dashboard provisionado automáticamente

## Qué se agregó

- Instrumentación HTTP en Laravel con `promphp/prometheus_client_php`
- Middleware global para contar requests, medir latencia y requests en vuelo
- Endpoint público `/metrics`
- Servicio `prometheus-service` en el `docker-compose.yml` raíz
- Servicio `grafana-service` en el `docker-compose.yml` raíz
- Provisioning automático de data source y dashboard en Grafana

## Archivos clave

- `docker-compose.yml`
- `Satelite-Delivery/config/prometheus.php`
- `Satelite-Delivery/app/Http/Middleware/RecordPrometheusMetrics.php`
- `Satelite-Delivery/app/Services/Metrics/PrometheusService.php`
- `Satelite-Delivery/app/Http/Controllers/MetricsController.php`
- `observability/prometheus/prometheus.yml`
- `observability/grafana/provisioning/datasources/prometheus.yml`
- `observability/grafana/provisioning/dashboards/dashboards.yml`
- `observability/grafana/dashboards/satelite-delivery-overview.json`

## Cómo levantar todo

1. Inicia Docker Desktop o el daemon de Docker.
2. Desde la raíz del repo ejecuta:

```powershell
docker compose up -d --build
```

3. Verifica el estado:

```powershell
docker compose ps
```

4. Si es la primera vez, ejecuta las migraciones del backend:

```powershell
docker compose exec backend-php-service php artisan migrate
```

## URLs importantes

- Frontend: `http://localhost`
- Backend Laravel: `http://localhost:8080`
- Health check Laravel: `http://localhost:8080/up`
- Métricas Prometheus: `http://localhost:8080/metrics`
- Prometheus UI: `http://localhost:9090`
- Grafana: `http://localhost:3000`

Credenciales iniciales de Grafana:

- Usuario: `admin`
- Password: `admin`

## Cómo funciona internamente

1. Laravel registra métricas HTTP en cada request mediante el middleware global `RecordPrometheusMetrics`.
2. Las métricas se guardan usando el adapter `PDO` de `promphp/prometheus_client_php`.
3. Esas series se almacenan en la misma base PostgreSQL del proyecto con prefijo `prometheus_metrics`.
4. El endpoint `/metrics` renderiza el formato de texto que Prometheus entiende.
5. Prometheus hace scrape cada 15 segundos al target `backend-nginx-service:80/metrics`.
6. Grafana arranca con Prometheus ya configurado como data source y con un dashboard cargado.

## Métricas disponibles

Las principales métricas que se exponen son:

- `satelite_delivery_http_requests_total`
- `satelite_delivery_http_request_duration_seconds`
- `satelite_delivery_http_requests_in_flight`

Etiquetas usadas:

- `method`
- `route`
- `status_code`
- `status_class`

## Qué muestra el dashboard

- Peticiones por segundo
- Latencia promedio
- Latencia p95
- Peticiones por clase de estado (`2xx`, `4xx`, `5xx`)
- Requests en vuelo
- Top 5 rutas por tráfico

## Cómo generar tráfico para ver datos

Puedes navegar la app o lanzar requests manuales:

```powershell
curl.exe http://localhost:8080/
curl.exe http://localhost:8080/up
curl.exe http://localhost:8080/metrics
```

Si quieres ver más actividad real, usa los endpoints de la API desde la app o con un cliente HTTP.

## Cómo entender el compose

Servicios relevantes del compose raíz:

- `backend-php-service`: ejecuta Laravel y registra las métricas
- `backend-nginx-service`: expone Laravel en `localhost:8080`
- `db-service`: PostgreSQL del proyecto y almacenamiento de series Prometheus
- `prometheus-service`: scrapea `/metrics` y guarda series temporales
- `grafana-service`: visualiza métricas con dashboards

Volúmenes relevantes:

- `postgres-data`: datos de PostgreSQL
- `prometheus-data`: base temporal de Prometheus
- `grafana-data`: configuración interna de Grafana

## Validaciones rápidas

Verifica que el endpoint exista:

```powershell
curl.exe http://localhost:8080/metrics
```

Debes ver texto tipo:

```text
# HELP satelite_delivery_http_requests_total Total HTTP requests handled by the application.
# TYPE satelite_delivery_http_requests_total counter
```

Verifica targets en Prometheus:

- Abre `http://localhost:9090/targets`
- El job `satelite-delivery-backend` debe aparecer como `UP`

Verifica dashboard en Grafana:

1. Abre `http://localhost:3000`
2. Inicia sesión
3. Entra al dashboard `Satelite Delivery - API Overview`

## Comandos útiles

Logs de observabilidad:

```powershell
docker compose logs -f prometheus-service
docker compose logs -f grafana-service
docker compose logs -f backend-php-service
```

Apagar servicios:

```powershell
docker compose down
```

Apagar y borrar volúmenes:

```powershell
docker compose down -v
```

## Troubleshooting

### Docker no responde

Si `docker compose` falla con error de daemon:

- abre Docker Desktop
- espera a que el engine esté activo
- vuelve a ejecutar `docker compose up -d --build`

### `/metrics` no responde

Revisa rutas y logs:

```powershell
docker compose exec backend-php-service php artisan route:list
docker compose logs backend-php-service
```

### Grafana abre pero no hay datos

- genera tráfico primero
- revisa `http://localhost:9090/targets`
- confirma que `backend-nginx-service` esté `UP`

### Prometheus scrapea pero no ves series de app

Revisa que el backend haya recibido requests distintas a `/metrics` y `/up`, porque ambas están excluidas de la instrumentación para no contaminar los gráficos.
