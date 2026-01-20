import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            host: process.env.POSTGRES_HOST, 
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Teste rápido de conexão ao iniciar
        this.pool.on('connect', () => {
            console.log('✅ Conexão com o banco de dados estabelecida!');
        });

        this.pool.on('error', (err) => {
            console.error('❌ Erro inesperado no cliente do banco', err);
            process.exit(-1);
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Executa queries simples.
     */
    public async query(text: string, params?: any[]): Promise<QueryResult> {
        return await this.pool.query(text, params);
    }

    /**
     * Obtém um cliente para Transações (BEGIN/COMMIT).
     */
    public async getClient(): Promise<PoolClient> {
        const client = await this.pool.connect();
        return client;
    }
}

export default Database.getInstance();