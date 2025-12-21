const connectionString = process.env.DATABASE_URL;

// Lazy-load pg to bypass Turbopack symlink errors on Windows at build-time
let poolInstance: any = null;

export function getPool() {
    if (poolInstance) return poolInstance;

    try {
        const { Pool } = eval('require("pg")');
        if (!connectionString) {
            console.warn("DATABASE_URL is missing. DB operations will fail.");
            return null;
        }

        poolInstance = new Pool({
            connectionString,
            max: 10,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 2_000, // Reduced to 2 seconds for faster fallback
        });

        poolInstance.on('error', (err: any) => {
            console.error('Unexpected error on idle client', err);
        });

        return poolInstance;
    } catch (err) {
        console.error("Failed to initialize database pool (Check your pg installation):", err);
        return null;
    }
}

// For compatibility with existing imports
export const pool = null as any;
