const log4js = require('log4js');

log4js.configure({  
  appenders: {
    consola: { type: "console" },
    file_info: { type: "file", filename: "./src/logs/files/info.log" },
    file_error: { type: "file", filename: "./src/logs/files/error.log" },
    file_warning: { type: "file", filename: "./src/logs/files/warning.log" },
  },
  categories: {
    default: {
      appenders: ["consola"],
      level: "all"
    },
    INFO: {
      appenders: ["consola","file_info"],
      level: "all"
    },
    WARNING: {
      appenders: ["consola", "file_warning"],
      level: "WARN"
    },
    ERROR: {
      appenders: ["consola", "file_error"],
      level: "ERROR"
    }
  }
});

const logger_info = log4js.getLogger('INFO');
const logger_warn = log4js.getLogger('WARNING');
const logger_error = log4js.getLogger('ERROR');

module.exports = { logger_info, logger_warn, logger_error };