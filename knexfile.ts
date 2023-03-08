import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_CHARSET,
  DB_TIMEZONE,
} from './src/config'

if (
  !DB_HOST ||
  !DB_PORT ||
  !DB_USER ||
  !DB_PASSWORD ||
  !DB_CHARSET ||
  !DB_DATABASE ||
  !DB_TIMEZONE
) {
  throw new Error('DB ENV is undefined')
}
const dbConfig = {
  client: 'mysql',
  connection: {
    charset: DB_CHARSET,
    timezone: DB_TIMEZONE,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
    // stub: 'src/databases/stubs',
  },
  seeds: {
    directory: 'src/databases/seeds',
    // stub: 'src/databases/stubs',
  },
}

export default dbConfig
