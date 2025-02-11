import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().nonempty(),
  PORT: z.string().nonempty(),
  DYNAMO_REGION: z.string().nonempty(),
  DYNAMODB_ENDPOINT: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('Invalid environment variables:', error.format());
  process.exit(1);
}

export const {
  NODE_ENV,
  PORT,
  DYNAMO_REGION,
  DYNAMODB_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = data;
