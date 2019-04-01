import chalk from 'chalk';

const NRELAY = chalk.gray('nrelay');
const ERR = chalk.red('ERR!');
const OK = chalk.green('OK');
const WARN = chalk.bgYellow(chalk.black('WARN'));

/**
 * Logs an error message.
 * @param err The error to log.
 */
export function logErr(err: Error | string): void {
  process.stdout.write('\n');
  if (err instanceof Error) {
    process.stdout.write(`${NRELAY} ${ERR} ${chalk.magenta('code')} ${err.name}\n`);
    process.stdout.write(`${NRELAY} ${ERR} ${chalk.magenta('message')} ${err.message}\n`);
  } else {
    process.stdout.write(`${NRELAY} ${ERR} ${err}\n`);
  }
}

/**
 * Logs the result of a successful operation.
 * @param messages The messages to log.
 */
export function logOk(messages: string[]): void {
  process.stdout.write('\n');
  for (const message of messages) {
    process.stdout.write(`${NRELAY} ${OK} ${message}\n`);
  }
}

/**
 * Logs a warning message.
 * @param message The message to log.
 */
export function logWarn(message: string): void {
  process.stdout.write(`${NRELAY} ${WARN} ${message}\n`);
}
