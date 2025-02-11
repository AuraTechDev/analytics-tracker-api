import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  DYNAMO_REGION: z.string().default('us-east-1'),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('Invalid environment variables:', error.format());
  process.exit(1);
}

export const { NODE_ENV, PORT, DATABASE_URL, DYNAMO_REGION } = data;
