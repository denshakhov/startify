import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

export interface IFastifyInternalServerErrorOptions {
    showErrors?: boolean
    message?: string
}

const fastifyInternalServerError: FastifyPluginAsync<IFastifyInternalServerErrorOptions> = async function (fastify, options = {}) {
    if (options.showErrors) return

    const logger = fastify.log.child({ plugin: 'fastify-internal-server-error' })

    fastify.setErrorHandler(async function (error, request, reply) {
        logger.error(error)

        await reply.code(500).send({
            error: options.message ?? 'Internal Server Error',
            statusCode: 500,
        })
    })
}

export default fp(fastifyInternalServerError)
