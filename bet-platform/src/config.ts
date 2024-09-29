export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  host: process.env.HOST || '0.0.0.0',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  providerUrl: process.env.PROVIDER_URL || 'http://localhost:3000',
};