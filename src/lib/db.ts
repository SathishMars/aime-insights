const connectionString = process.env.DATABASE_URL;
console.log("[DB] DATABASE_URL presence:", !!connectionString);
if (connectionString) {
    console.log("[DB] DATABASE_URL starts with:", connectionString.substring(0, 20) + "...");
}


// Lazy-load pg to bypass Turbopack symlink errors on Windows at build-time
let poolInstance: any = null;

export function getPool() {
    if (poolInstance) return poolInstance;

    try {
        const { Pool } = eval('require("pg")');
        console.log("[DB] Initializing new pool...");
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

// For compatibility with existing imports, we export a proxy that lazily initializes the pool
export const pool = new Proxy({} as any, {
    get(target, prop) {
        const instance = getPool();
        if (!instance) {
            throw new Error("Database pool not initialized. Check DATABASE_URL.");
        }
        const value = instance[prop];
        // Critical: Bind functions to the instance so 'this' works correctly (e.g. pool.query)
        if (typeof value === 'function') {
            return value.bind(instance);
        }
        return value;
    }
});
