import { createClient } from 'redis';

export const redis = createClient({
  url: `redis://${process.env.REDIS_HOSTNAME || 'redis'}:${process.env.REDIS_PORT || 6379}`,
});

redis.on('error', (err: Error) => console.error(err));
redis.connect();
