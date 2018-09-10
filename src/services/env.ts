type Env = {
  sentryDSN: string
}

const env: Env = {
  sentryDSN: process.env.SENTRY_DSN || '',
}

export default env
