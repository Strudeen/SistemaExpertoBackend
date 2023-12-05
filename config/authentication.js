module.exports = {
    secret: process.env.AUTH_SECRET || "SORE9BuVFZY63mC",
    expires: process.env.AUTH_EXPIRES || "24h",
    rounds: process.env.AUTH_ROUNDS || 10
}