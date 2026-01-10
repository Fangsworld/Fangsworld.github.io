import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 延迟获取 DATABASE_URL，以便支持 dotenv 等工具加载环境变量
function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

function createDbConnection() {
  const DATABASE_URL = getDatabaseUrl();

  if (!DATABASE_URL) {
    console.warn('DATABASE_URL environment variable is not set. Database features will be disabled.');
    return null;
  }

  try {
    const sql = neon(DATABASE_URL);
    return drizzle(sql, { schema });
  } catch (error) {
    console.error('Failed to create database connection:', error);
    return null;
  }
}

// 创建数据库连接（如果存在 DATABASE_URL）
export const db = createDbConnection();

// 检查数据库是否可用
export const isDatabaseEnabled = !!getDatabaseUrl();

// 动态检查数据库连接
export function getDb() {
  if (!db) {
    throw new Error('Database is not available. Please set DATABASE_URL environment variable.');
  }
  return db;
}
