import execa from 'execa';
import Listr from 'listr';
import * as assets from '../util/assets';
import * as fsUtil from '../util/fs-util';
import { cwd } from '../util/path-util';

// tslint:disable-next-line: no-var-requires
const cliVersion = require('../../package.json').version;

/**
 * Creates a new nrelay project.
 */
export const newCmd = new Listr([
  // create the project folder.
  {
    title: 'Creating project folder',
    task: (ctx) => {
      if (typeof ctx.name !== 'string') {
        return Promise.reject(new Error('A project name is required to create a new project.'));
      } else {
        return fsUtil.mkdir(cwd(ctx.name));
      }
    },
  },
  // create the src/ and resources/ folders.
  {
    title: 'Creating required folders',
    task: () => new Listr([
      {
        title: 'Creating src folder',
        task: (ctx) => fsUtil.mkdir(cwd(ctx.name, 'src')),
      },
      {
        title: 'Creating resources folder',
        task: (ctx) => fsUtil.mkdir(cwd(ctx.name, 'resources')),
      },
    ], { concurrent: true }),
  },
  // create the necessary nrelay files.
  {
    title: 'Creating project files',
    task: () => new Listr([
      {
        title: 'Creating package.json',
        task: (ctx) => fsUtil.copyTransform(
          assets.pathOf('pkg.json'),
          cwd(ctx.name, 'package.json'),
          (str) => str.replace('{{name}}', ctx.name),
        ),
      },
      {
        title: 'Creating src/hello-plugin.ts',
        task: (ctx) => fsUtil.copyFile(assets.pathOf('hello-plugin.ts'), cwd(ctx.name, 'src', 'hello-plugin.ts')),
      },
      {
        title: 'Creating accounts.json',
        task: (ctx) => fsUtil.copyFile(assets.pathOf('accounts.json'), cwd(ctx.name, 'accounts.json')),
      },
      {
        title: 'Creating versions.json',
        task: (ctx) => fsUtil.copyFile(assets.pathOf('versions.json'), cwd(ctx.name, 'versions.json')),
      },
      {
        title: 'Creating tsconfig.json',
        task: (ctx) => fsUtil.copyFile(assets.pathOf('tsc.json'), cwd(ctx.name, 'tsconfig.json')),
      },
      {
        title: 'Creating .gitignore',
        task: (ctx) => fsUtil.copyFile(assets.pathOf('gitignore.txt'), cwd(ctx.name, '.gitignore')),
      },
      {
        title: 'Creating .nrelay',
        task: (ctx) => fsUtil.copyTransform(
          assets.pathOf('.nrelay'),
          cwd(ctx.name, '.nrelay'),
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
        task: (ctx) => execa('npm', ['install', 'nrelay@next', '--save'], { cwd: cwd(ctx.name) }),
      },
      {
        title: 'Install TypeScript',
        task: (ctx) => execa('npm', ['install', 'typescript', '@types/node', '--save-dev'], { cwd: cwd(ctx.name) }),
      },
    ]),
  },
  // build the project
  {
    title: 'Build the project',
    task: (ctx) => execa('npm', ['run', 'compile'], { cwd: cwd(ctx.name) }),
  },
]);
