port ENV.fetch("APP_PORT", "3000")
environment ENV.fetch("RACK_ENV", "development")
workers 0
threads 2, 5
preload_app!
stdout_redirect STDOUT, STDERR, true