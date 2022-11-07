import path from 'node:path'
import type { PoolConfig } from 'pg'
import type { FastifyServerOptions } from 'fastify'

export type IConfig = {
    port: string | number
    requestLogging: boolean
    showInternalServerError: boolean
    webappUrl: string
    listen: string
    logger: FastifyServerOptions['logger']
    postgres: PoolConfig
}

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-member-access
export const config: IConfig = require(path.join(__dirname, `config.${process.env.RUN_ENV}.js`)).default
