import { fastify } from 'fastify'
import fastifyPostgres from '@fastify/postgres'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyGracefulShutdown from './plugins/fastify-graceful-shutdown'
import fastifyInternalServerError from './plugins/fastify-internal-server-error'
import { tasksRoutes } from './modules/tasks/tasks.routes'
import { config } from './config/config'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { FastifyApp } from './types'

export async function buildApplication(): Promise<FastifyApp> {
    const app = fastify({
        logger: config.logger,
        ignoreTrailingSlash: true,
        trustProxy: true,
        disableRequestLogging: !config.requestLogging,
        ajv: {
            customOptions: {
                coerceTypes: false,
                allErrors: false,
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    // Plugins
    await app.register(fastifyInternalServerError, {
        showErrors: config.showInternalServerError,
    })
    await app.register(fastifyGracefulShutdown)
    await app.register(fastifyCookie)
    await app.register(fastifyCors, {
        origin: config.webappUrl,
        credentials: true,
        maxAge: 86400,
    })
    await app.register(fastifyPostgres, config.postgres)

    // Routes
    await tasksRoutes(app)

    return app
}
