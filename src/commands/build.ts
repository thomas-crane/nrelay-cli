import execa from 'execa';
import Listr from 'listr';
import { rm } from '../util/fs-util';
import { cwd } from '../util/path-util';

/**
 * Builds the nrelay project.
 */
export const build = new Listr([
  {
    title: 'Clean project',
    task: () => {
      // use the outDir from the tsconfig so it's always up to date.
      const outPath = require(cwd('tsconfig.json')).compilerOptions.outDir;
      return rm(cwd(outPath));
    },
  },
  {
    title: 'Build project',
    task: () => execa('npm', ['run', 'compile']),
  },
]);
