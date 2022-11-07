import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

export interface IGracefulShutdownOptions {
    timeoutSeconds?: number
}

const fastifyGracefulShutdown: FastifyPluginAsync<IGracefulShutdownOptions> = async function (fastify, options = {}) {
    const logger = fastify.log.child({ plugin: 'fastify-graceful-shutdown' })
    const timeoutSeconds = options.timeoutSeconds ?? 10
    let stopping = false

    function shutdown(signalOrEvent: string, shutdownError?: Error): void {
        if (stopping) return

        stopping = true

        if (shutdownError) {
            logger.error({ signalOrEvent, err: shutdownError }, `Graceful shutdown due to error: ${signalOrEvent}`)
        } else {
            logger.info(`Received signal: ${signalOrEvent}`)
        }

        setTimeout(() => {
            logger.error('Terminate process after timeout')
            process.exit(1)
        }, timeoutSeconds * 1000).unref()

        fastify
            .close()
            .then(() => {
                logger.info({ signalOrEvent }, 'Process terminated')
                process.exit(0)
            })
            .catch(error => {
                logger.error({ signalOrEvent, err: error }, 'Process terminated')
                process.exit(1)
            })
    }

    for (const event of ['SIGINT', 'SIGTERM', 'SIGUSR2']) {
        process.once(event, () => {
            shutdown(event)
        })
    }

    for (const event of ['uncaughtException', 'unhandledRejection']) {
        process.once(event, (error: Error) => {
            shutdown(event, error)
        })
    }
}

export default fp(fastifyGracefulShutdown)
