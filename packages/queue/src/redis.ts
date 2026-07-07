import "dotenv/config";
import type { RedisOptions } from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

function createRedisConnection(url: string): RedisOptions {
  const parsedUrl = new URL(url);

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 6379),
    username: parsedUrl.username || undefined,
    password: parsedUrl.password || undefined,
    db: parsedUrl.pathname ? Number(parsedUrl.pathname.replace("/", "")) || 0 : 0,
    maxRetriesPerRequest: null,
  };
}

export const redisConnection = createRedisConnection(redisUrl);
