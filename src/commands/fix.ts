import execa from 'execa';
import Listr from 'listr';
import { sep } from 'path';
import * as assets from '../util/assets';
import * as fsUtil from '../util/fs-util';
import { cwd } from '../util/path-util';

// tslint:disable-next-line: no-var-requires
const cliVersion = require('../../package.json').version;

/**
 * "Fixes" an existing nrelay project by ensuring all of the required files exist.
 * This is pretty much just the `new` command, but with skip-if-exist logic.
 */
export const fix = new Listr([
  // create the src/ and resources/ folders.
  {
    title: 'Ensure required folders exist',
    task: () => new Listr([
      {
        title: 'Creating src folder',
        skip: () => fsUtil.exists(cwd('src')),
        task: () => fsUtil.mkdir(cwd('src')),
      },
      {
        title: 'Creating resources folder',
        skip: () => fsUtil.exists(cwd('resources')),
        task: () => fsUtil.mkdir(cwd('resources')),
      },
    ], { concurrent: true }),
  },
  // create the necessary nrelay files.
  {
    title: 'Ensure project files exist',
    task: () => new Listr([
      {
        title: 'Creating package.json',
        skip: () => fsUtil.exists(cwd('package.json')),
        task: () => fsUtil.copyTransform(
          assets.pathOf('pkg.json'),
          cwd('package.json'),
          (str) => str.replace('{{name}}', process.cwd().split(sep).pop() || 'my-nrelay-project'),
        ),
      },
      {
        title: 'Creating src/hello-plugin.ts',
        skip: () => fsUtil.exists(cwd('src', 'hello-plugin.ts')),
        task: () => fsUtil.copyFile(assets.pathOf('hello-plugin.ts'), cwd('src', 'hello-plugin.ts')),
      },
      {
        title: 'Creating accounts.json',
        skip: () => fsUtil.exists(cwd('accounts.json')),
        task: () => fsUtil.copyFile(assets.pathOf('accounts.json'), cwd('accounts.json')),
      },
      {
        title: 'Creating versions.json',
        skip: () => fsUtil.exists(cwd('versions.json')),
        task: () => fsUtil.copyFile(assets.pathOf('versions.json'), cwd('versions.json')),
      },
      {
        title: 'Creating tsconfig.json',
        skip: () => fsUtil.exists(cwd('tsconfig.json')),
        task: () => fsUtil.copyFile(assets.pathOf('tsc.json'), cwd('tsconfig.json')),
      },
      {
        title: 'Creating .gitignore',
        skip: () => fsUtil.exists(cwd('.gitignore')),
        task: () => fsUtil.copyFile(assets.pathOf('gitignore.txt'), cwd('.gitignore')),
      },
      {
        title: 'Creating .nrelay',
        skip: () => fsUtil.exists(cwd('.nrelay')),
        task: () => fsUtil.copyTransform(
          assets.pathOf('.nrelay'),
          cwd('.nrelay'),
          (str) => str
            .replace('{{date}}', (new Date()).toString())
            .replace('{{version}}', cliVersion),
        ),
      },
    ], { concurrent: true }),
  },
  // install the dependencies
  {
    title: 'Install npm dependencies',
    task: () => new Listr([
      {
        title: 'Install nrelay',
        skip: () => fsUtil.exists(cwd('node_modules', 'nrelay')),
        task: () => execa('npm', ['install', 'nrelay@next', '--save']),
      },
      {
        title: 'Install TypeScript',
        skip: () => Promise.all([
          fsUtil.exists(cwd('node_modules', 'typescript')),
          fsUtil.exists(cwd('node_modules', '@types', 'node')),
        ]).then(([a, b]) => a && b),
        task: () => execa('npm', ['install', 'typescript', '@types/node', '--save-dev']),
      },
    ]),
  },
  // build the project
  {
    title: 'Build the project',
    skip: () => fsUtil.exists(cwd('lib')),
    task: () => execa('npm', ['run', 'compile']),
  },
]);
