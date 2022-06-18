import { buildApplication } from './app'
import { config } from './config/config'

buildApplication()
    .then(async app => {
        await app.listen({
            port: +config.port,
            host: config.listen,
        })
    })
    .catch(error => {
        console.log(error)
        process.exit(1)
    })
