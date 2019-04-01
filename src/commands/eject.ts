import execa from 'execa';
import Listr from 'listr';
import * as assets from '../util/assets';
import * as fsUtil from '../util/fs-util';
import { cwd } from '../util/path-util';

/**
 * Allows the project to be run independently of the CLI.
 */
export const eject = new Listr([
  // create the index file.
  {
    title: 'Create index.js',
    task: () => fsUtil.copyFile(assets.pathOf('self-host.js'), cwd('index.js')),
  },
  // install the dependencies
  {
    title: 'Install npm dependencies',
    task: () => new Listr([
      {
        title: 'Install yargs',
        task: () => execa('npm', ['install', 'yargs', '--save']),
      },
    ]),
  },
]);
