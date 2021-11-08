const { addColors, createLogger, format, transports } = require("winston");

const { label, json, timestamp, align, printf } = format;

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
  },
  colors: {
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "grey",
    info: "green",
    verbose: "cyan",
    silly: "magenta",
    custom: "yellow",
  },
};

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`;
});

const errorLogger = createLogger({
  levels: config.levels,
  format: format.combine(
    label({ label: "👻  Error!" }),
    json(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    myFormat
  ),
  defaultMeta: { service: "trm-data-service" },
  transports: [
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

const infoLogger = createLogger({
  levels: config.levels,
  format: format.combine(
    label({ label: "🚩 Info!" }),
    json(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    myFormat
  ),
  defaultMeta: { service: "trm-data-service" },
  transports: [
    new transports.File({
      filename: "logs/info.log",
      level: "info",
    }),
  ],
});

infoLogger.add(new transports.Console());
errorLogger.add(new transports.Console());

addColors(config.colors);

module.exports = (type, message, infoList, isThrowRequired = false) => {
  if (infoList !== undefined) {
    infoList.forEach((info) => {
      message += ` -- ${info.message}`;
    });
  }
  if (type === "info") {
    infoLogger.log(type, {
      message,
    });
  } else if (type === "error") {
    errorLogger.log(type, {
      message,
    });
  }
  if (isThrowRequired) {
    throw new Error(message);
  }
};
