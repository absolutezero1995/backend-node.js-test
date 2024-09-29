declare module '@fastify/swagger-ui' {
  import { FastifyPluginAsync } from 'fastify'
  const swaggerUi: FastifyPluginAsync
  export default swaggerUi
}