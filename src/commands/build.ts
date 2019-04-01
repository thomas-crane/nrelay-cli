import execa from 'execa';
import Listr from 'listr';

/**
 * Builds the nrelay project.
 */
export const build = new Listr([
  {
    title: 'Build project',
    task: () => execa('npm', ['run', 'compile']),
  },
]);
