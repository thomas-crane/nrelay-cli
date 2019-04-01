#!/usr/bin/env node

import chalk from 'chalk';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { build } from './commands/build';
import { eject } from './commands/eject';
import { newCmd } from './commands/new';
import { run } from './commands/run';
import * as fsUtil from './util/fs-util';
import { logErr, logOk, logWarn } from './util/log';
import { cwd } from './util/path-util';

// tslint:disable-next-line: no-var-requires
const cliVersion = require('../package.json').version;
let nrelayVersion: string;

if (existsSync(cwd('node_modules', 'nrelay', 'package.json'))) {
  // tslint:disable-next-line: no-var-requires
  nrelayVersion = `v${require(cwd('node_modules', 'nrelay', 'package.json')).version}`;
} else {
  nrelayVersion = 'No local nrelay installed.';
}

const versionString = [
  `CLI version:    v${cliVersion}`,
  `nrelay version: ${nrelayVersion}`,
].join('\n');

// tslint:disable-next-line: no-unused-expression
yargs
  .scriptName('nrelay')
  .usage('$0 <cmd> [args]')
  .strict()
  .version(versionString)
  .alias('v', 'version')
  .option('force', {
    default: false,
    type: 'boolean',
    describe: 'Forces the CLI to ignore warnings.',
  })
  .command('run', 'Run an nrelay project.', (args) => {
    return args
      .option('update', {
        default: true,
        describe: 'Check for updates',
      })
      .option('debug', {
        default: false,
        describe: 'Log more information',
      });
  }, (args: any) => {
    return fsUtil.exists(cwd('.nrelay')).then((exists) => {
      // run the command if .nrelay exists or --force is enabled.
      const shouldRun = exists ? true : args.force === true;
      if (shouldRun) {
        if (args.force === true) {
          logWarn(`using ${chalk.magenta('--force')}`);
        }
        return run(args);
      } else {
        const err = new Error('This folder does not appear to be an nrelay project.');
        err.name = 'NOT_NRELAY_PROJECT';
        throw err;
      }
    }).catch((err) => {
      logErr(err);
    });
  })
  .command('new <name>', 'Create a new project.', (args) => {
    return args.positional('name', {
      describe: 'The name of the new project',
      type: 'string',
    });
  }, (args) => {
    newCmd.run(args).then(() => {
      logOk([
        'Created new project.',
        `Run ${chalk.magenta(`cd ${args.name} && nrelay`)} to get started!`,
      ]);
    }).catch((err) => {
      logErr(err);
    });
  })
  .command('build', 'Build an nrelay project.', () => undefined, (args) => {
    return fsUtil.exists(cwd('.nrelay')).then((exists) => {
      const shouldRun = exists ? true : args.force === true;
      if (shouldRun) {
        if (args.force === true) {
          logWarn(`using ${chalk.magenta('--force')}`);
        }
        return build.run(args);
      } else {
        const err = new Error('This folder does not appear to be an nrelay project.');
        err.name = 'NOT_NRELAY_PROJECT';
        throw err;
      }
    }).catch((err) => {
      logErr(err);
    });
  })
  .command('eject', 'Allows the project to be run without the CLI.', () => undefined, (args) => {
    return fsUtil.exists(cwd('.nrelay')).then((exists) => {
      // run the command if .nrelay exists or --force is enabled.
      const shouldRun = exists ? true : args.force === true;
      if (shouldRun) {
        if (args.force === true) {
          logWarn(`using ${chalk.magenta('--force')} This command will install npm packages!`);
        }
        return eject.run(args);
      } else {
        const err = new Error('This folder does not appear to be an nrelay project.');
        err.name = 'NOT_NRELAY_PROJECT';
        throw err;
      }
    }).catch((err) => {
      logErr(err);
      if (err.name === 'NOT_NRELAY_PROJECT') {
        logErr('Use --force to eject this project anyway.');
      }
    });
  })
  .demandCommand(1, 'Please provide a command to invoke.')
  .help()
  .argv;
