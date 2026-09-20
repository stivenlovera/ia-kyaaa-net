// Servidor MCP "mysql-kyaaa": acceso de solo lectura a la base de datos MariaDB de kyaaa.net.
// Usa las mismas variables de entorno que el proyecto (.env de la raíz): DB_HOST, DB_PORT,
// DB_USER, DB_PASS, DB_DATABASE, DB_CONECTION_LIMIT. Si no existen, cae en DATABASE_URL.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import mysql from 'mysql2/promise';
import { z } from 'zod';

// Carga el .env de la raíz del proyecto sin pisar variables ya definidas en el entorno.
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
try {
  process.loadEnvFile(path.join(rootDir, '.env'));
} catch {
  // Sin .env: se usan solo las variables del entorno del proceso.
}

function getDbConfig() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE, DB_CONECTION_LIMIT, DATABASE_URL } = process.env;
  if (DB_HOST && DB_USER && DB_DATABASE) {
    return {
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASS ?? '',
      database: DB_DATABASE,
      connectionLimit: Number(DB_CONECTION_LIMIT) || 5,
    };
  }
  if (DATABASE_URL) {
    const url = new URL(DATABASE_URL);
    return {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      connectionLimit: Number(DB_CONECTION_LIMIT) || 5,
    };
  }
  throw new Error('Faltan variables de entorno: define DB_HOST/DB_USER/DB_DATABASE o DATABASE_URL en el .env');
}

const dbConfig = getDbConfig();
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  // Se limita el pool: un servidor MCP local no necesita más.
  connectionLimit: Math.min(dbConfig.connectionLimit, 5),
  timezone: 'Z',
  dateStrings: true,
});

const MAX_ROWS = 500;
const READ_ONLY_START = /^\s*(select|show|describe|desc|explain|with)\b/i;

// Ejecuta dentro de una transacción READ ONLY: el servidor rechaza cualquier escritura,
// incluso si la consulta intentara colarla (p. ej. un CTE con INSERT).
async function runReadOnly(sql, params = []) {
  const conn = await pool.getConnection();
  try {
    await conn.query('SET SESSION TRANSACTION READ ONLY');
    await conn.beginTransaction();
    try {
      const [rows] = await conn.query({ sql, values: params, timeout: 30_000 });
      return rows;
    } finally {
      await conn.rollback();
    }
  } finally {
    await conn.query('SET SESSION TRANSACTION READ WRITE').catch(() => {});
    conn.release();
  }
}

const asText = (value) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});
const asError = (error) => ({
  isError: true,
  content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
});

const server = new McpServer({ name: 'mysql-kyaaa', version: '1.0.0' });

server.registerTool(
  'query',
  {
    description: `Ejecuta una consulta SQL de solo lectura (SELECT/SHOW/DESCRIBE/EXPLAIN/WITH) en la base "${dbConfig.database}". Devuelve como máximo ${MAX_ROWS} filas.`,
    inputSchema: { sql: z.string().describe('Consulta SQL de solo lectura') },
  },
  async ({ sql }) => {
    try {
      if (!READ_ONLY_START.test(sql)) {
        throw new Error('Solo se permiten consultas SELECT, SHOW, DESCRIBE, EXPLAIN o WITH.');
      }
      const rows = await runReadOnly(sql);
      if (Array.isArray(rows) && rows.length > MAX_ROWS) {
        return asText({ truncated: true, total: rows.length, rows: rows.slice(0, MAX_ROWS) });
      }
      return asText(rows);
    } catch (error) {
      return asError(error);
    }
  },
);

server.registerTool(
  'list_tables',
  { description: `Lista las tablas de la base "${dbConfig.database}" con su número aproximado de filas.` },
  async () => {
    try {
      const rows = await runReadOnly(
        `SELECT TABLE_NAME AS name, TABLE_TYPE AS type, TABLE_ROWS AS approx_rows
           FROM information_schema.TABLES
          WHERE TABLE_SCHEMA = DATABASE()
          ORDER BY TABLE_NAME`,
      );
      return asText(rows);
    } catch (error) {
      return asError(error);
    }
  },
);

server.registerTool(
  'describe_table',
  {
    description: 'Describe las columnas, índices y claves foráneas de una tabla.',
    inputSchema: { table: z.string().regex(/^[\w$]+$/, 'Nombre de tabla inválido').describe('Nombre de la tabla') },
  },
  async ({ table }) => {
    try {
      const columns = await runReadOnly(
        `SELECT COLUMN_NAME AS name, COLUMN_TYPE AS type, IS_NULLABLE AS nullable,
                COLUMN_KEY AS \`key\`, COLUMN_DEFAULT AS \`default\`, EXTRA AS extra
           FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION`,
        [table],
      );
      if (columns.length === 0) throw new Error(`La tabla "${table}" no existe.`);
      const indexes = await runReadOnly(
        `SELECT INDEX_NAME AS name, NON_UNIQUE = 0 AS \`unique\`, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns
           FROM information_schema.STATISTICS
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
          GROUP BY INDEX_NAME, NON_UNIQUE`,
        [table],
      );
      const foreignKeys = await runReadOnly(
        `SELECT COLUMN_NAME AS \`column\`, REFERENCED_TABLE_NAME AS ref_table, REFERENCED_COLUMN_NAME AS ref_column
           FROM information_schema.KEY_COLUMN_USAGE
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
        [table],
      );
      return asText({ table, columns, indexes, foreignKeys });
    } catch (error) {
      return asError(error);
    }
  },
);

await server.connect(new StdioServerTransport());
console.error(`[mysql-kyaaa] conectado a ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (solo lectura)`);
