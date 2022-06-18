import { Client } from 'pg'

if (['production', 'staging'].includes(process.env.RUN_ENV!)) {
    throw new Error('The script cannot be run in production or staging environment')
}

async function teardown() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })

    await client.connect()
    await client.query(/* sql */ `DROP DATABASE IF EXISTS app_testing`)
    await client.end()
}

teardown().catch(error => {
    console.error(error)
    process.exit(1)
})
