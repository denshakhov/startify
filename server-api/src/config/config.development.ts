import type { IConfig } from './config'

const config: IConfig = {
    port: process.env.PORT,
    listen: '0.0.0.0',
    webappUrl: process.env.WEBAPP_URL,
    logger: {
        level: 'trace',
    },
    requestLogging: true,
    showInternalServerError: true,
    postgres: {
        connectionString: process.env.DATABASE_URL,
    },
}

export default config
