import { createClient } from 'redis'

// connect ke redis
const client = createClient();
const port = 6379

client.on("error", (err) => console.log("Redis client error", err));
client.on("ready", () => console.log(`V Redis client connected at port ${port}`));
client.on("reconnecting", () => console.log(`V Redis client reconnecting to port ${port}`));

await client.connect();

export default client