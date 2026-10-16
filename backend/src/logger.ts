const LEVELS = { info: "INFO", warn: "WARN", error: "ERROR" } as const;

function log(level: keyof typeof LEVELS, context: string, msg: string, meta?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  const prefix = `${ts} [${LEVELS[level]}] [${context}]`;
  const line = meta ? `${prefix} ${msg} ${JSON.stringify(meta)}` : `${prefix} ${msg}`;
  level === "error" ? console.error(line) : console.log(line);
}

export const logger = {
  info:  (ctx: string, msg: string, meta?: Record<string, unknown>) => log("info",  ctx, msg, meta),
  warn:  (ctx: string, msg: string, meta?: Record<string, unknown>) => log("warn",  ctx, msg, meta),
  error: (ctx: string, msg: string, meta?: Record<string, unknown>) => log("error", ctx, msg, meta),
};
