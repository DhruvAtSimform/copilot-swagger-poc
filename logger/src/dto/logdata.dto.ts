enum logLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}
export class LogDataDto {
  level: logLevel;
  service: string;
  callStack?: string;
  message: string;
}
