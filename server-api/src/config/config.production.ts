import { IConfig } from './config'

const config: IConfig = {
    port: process.env.PORT,
    listen: '0.0.0.0',
    webappUrl: process.env.WEBAPP_URL,
    logger: {
        level: 'info',
    },
    requestLogging: false,
    showInternalServerError: false,
    postgres: {
        max: 20,
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    },
}

export default config
