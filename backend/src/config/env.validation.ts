const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

export function validateEnv(config: Record<string, unknown>) {
  const missingVars = requiredEnvVars.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variable${missingVars.length === 1 ? '' : 's'}: ${missingVars.join(', ')}. ` +
        'Create backend/.env from backend/.env.example before starting the API.'
    );
  }

  return config;
}
