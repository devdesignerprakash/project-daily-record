// Minimal structured logger — writes leveled, timestamped lines to
// stdout/stderr so Docker (and any log aggregator reading container logs)
// picks them up. Deliberately dependency-free; HTTP access logs are handled
// separately by morgan (see server.js), piped through this for consistent
// formatting.
const timestamp = () => new Date().toISOString();

const logger = {
    info: (...args) => console.log(`[${timestamp()}] [INFO]`, ...args),
    warn: (...args) => console.warn(`[${timestamp()}] [WARN]`, ...args),
    error: (...args) => console.error(`[${timestamp()}] [ERROR]`, ...args),
    debug: (...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`[${timestamp()}] [DEBUG]`, ...args);
        }
    },
};

export default logger;
