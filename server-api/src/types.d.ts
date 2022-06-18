import { Type } from '@sinclair/typebox'
import { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

export type FastifyApp = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyLoggerInstance,
    TypeBoxTypeProvider
>

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly WEBAPP_URL: string
            readonly RUN_ENV: 'development' | 'production' | 'staging' | 'ci'
            readonly NODE_ENV: 'development' | 'production'
            readonly PORT: string
            readonly DATABASE_URL: string
            readonly DATABASE_TESTING_URL: string
        }
    }
}
