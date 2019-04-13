import execa from 'execa';
import Listr from 'listr';

/**
 * Updates the nrelay dependency to the latest version.
 */
export const update = new Listr([
  // install the dependencies
  {
    title: 'Install latest npm dependencies',
    task: () => new Listr([
      {
        title: 'Install nrelay',
        task: () => execa('npm', ['install', 'nrelay@next', '--save']),
      },
    ]),
  },
]);
