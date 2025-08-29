interface ServerConfig {
  environment: string;
  port: number;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
}

const configuration = (): AppConfig => ({
  server: {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT || '3100', 10),
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'docgen_db',
    schema: process.env.DB_SCHEMA || 'public',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '6h',
  },
});

export default configuration;
