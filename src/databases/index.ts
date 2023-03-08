import Knex from 'knex'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_CHARSET,
  DB_TIMEZONE,
} from '@/config'

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
const dbConnection = {
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
  pool: {
    min: 2,
    max: 10,
  },
}

export default Knex(dbConnection)
