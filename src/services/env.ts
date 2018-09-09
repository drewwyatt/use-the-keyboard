type Env = {
  sentryDSN: string
}

const { SENTRY_DSN } = process.env

const env: Env = {
  sentryDSN: SENTRY_DSN || '',
}

export default env
