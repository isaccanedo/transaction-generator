module.exports = {
    postgres: {
	host: process.env.PGHOST || 'localhost',
	database: process.env.PGDATABASE || 'transaction-generator_dev',
	user: process.env.PGUSER || 'transaction-generator',
	password: process.env.PGPASSWORD || '',
	ssl: false,
	debug: false

    }

}
