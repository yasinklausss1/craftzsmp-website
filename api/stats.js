// Vercel Serverless Function: /api/stats
// Handles GET (public stats for craftzsmp.xyz) and POST (secure webhook from Minecraft BDS)
const Redis = require('ioredis');

const DEFAULT_STATS = {
    registeredPlayers: 32,
    moneyCirculation: 14750,
    questsCompleted: 48,
    homesSet: 39
};

const SYNC_SECRET = process.env.STATS_SYNC_SECRET || "craftz_secret_sync_2026";

let redisClient = null;

function getRedis() {
    if (!redisClient && process.env.REDIS_URL) {
        try {
            redisClient = new Redis(process.env.REDIS_URL, {
                connectTimeout: 4000,
                maxRetriesPerRequest: 1,
                lazyConnect: true
            });
        } catch (e) {
            console.error("Redis init error:", e);
        }
    }
    return redisClient;
}

async function getFromRedis() {
    const client = getRedis();
    if (!client) return null;

    try {
        if (client.status === 'wait') {
            await client.connect();
        }
        const data = await client.get('craftz_stats');
        if (data) {
            return JSON.parse(data);
        }
    } catch (err) {
        console.error("Redis get error:", err);
    }
    return null;
}

async function saveToRedis(statsData) {
    const client = getRedis();
    if (!client) return { ok: false, error: "No Redis client configured" };

    try {
        if (client.status === 'wait') {
            await client.connect();
        }
        const res = await client.set('craftz_stats', JSON.stringify(statsData));
        return { ok: res === 'OK', result: res };
    } catch (err) {
        return { ok: false, error: err.message };
    }
}

async function fetchLivePing() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch("https://api.mcstatus.io/v2/status/bedrock/craftz.cybrancee.games:60453", {
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        // Ping failed / timed out
    }
    return null;
}

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const authHeader = req.headers.authorization || '';
        const bodySecret = req.body && req.body.secret;
        const isAuthorized = authHeader === `Bearer ${SYNC_SECRET}` || bodySecret === SYNC_SECRET;

        if (!isAuthorized) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const payload = req.body || {};
        const newStats = {
            registeredPlayers: Number(payload.registeredPlayers) || DEFAULT_STATS.registeredPlayers,
            moneyCirculation: Number(payload.moneyCirculation) || DEFAULT_STATS.moneyCirculation,
            questsCompleted: Number(payload.questsCompleted) || DEFAULT_STATS.questsCompleted,
            homesSet: Number(payload.homesSet) || DEFAULT_STATS.homesSet,
            lastUpdated: Date.now()
        };

        const saved = await saveToRedis(newStats);
        res.status(200).json({ success: true, saved: saved.ok, result: saved.result, stats: newStats });
        return;
    }

    if (req.method === 'GET') {
        const [redisStats, pingData] = await Promise.all([
            getFromRedis(),
            fetchLivePing()
        ]);

        const mergedStats = {
            ...DEFAULT_STATS,
            ...(redisStats || {})
        };

        const isOnline = Boolean(pingData && pingData.online);
        const onlinePlayers = pingData && pingData.players ? (pingData.players.online || 0) : 0;
        const maxPlayers = pingData && pingData.players ? (pingData.players.max || 50) : 50;

        res.status(200).json({
            success: true,
            online: isOnline,
            onlinePlayers: onlinePlayers,
            maxPlayers: maxPlayers,
            serverIp: "craftz.cybrancee.games",
            serverPort: 60453,
            registeredPlayers: mergedStats.registeredPlayers,
            moneyCirculation: mergedStats.moneyCirculation,
            questsCompleted: mergedStats.questsCompleted,
            homesSet: mergedStats.homesSet,
            redisConfigured: Boolean(process.env.REDIS_URL),
            lastUpdated: mergedStats.lastUpdated || Date.now()
        });
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
};
