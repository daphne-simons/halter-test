import * as Path from 'node:path'
import * as URL from 'node:url'

const __filename = URL.fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

export default {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: Path.join(__dirname, 'device_data.db'),
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
  },

  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: ':memory:',
    },
    migrations: {
      directory: Path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: Path.join(__dirname, 'seeds'),
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
  },
}
