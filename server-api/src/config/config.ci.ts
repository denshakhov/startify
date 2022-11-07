import type { IConfig } from './config'
import configDevelopment from './config.development'

const config: IConfig = {
    ...configDevelopment,
    postgres: {
        connectionString: process.env.DATABASE_TESTING_URL,
        min: 0,
        max: 1,
    },
    logger: false,
    requestLogging: false,
}

export default config
