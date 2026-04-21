module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      /**
       * react-native-dotenv
       * Lee las variables de .env y las expone como módulo '@env'.
       * Uso: import { API_BASE_URL } from '@env';
       */
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: true,       // valida que las vars declaradas en .env.example existan
          allowUndefined: false,
        },
      ],
    ],
  };
};
