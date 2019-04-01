import * as nrelay from 'nrelay';
import { Arguments } from 'yargs';
import { cwd } from '../util/path-util';
import { build } from './build';

/**
 * Runs the nrelay project with the given arguments.
 * @param args The arguments to run the project with.
 */
export async function run(args: Arguments): Promise<void> {
  // check if the current folder has nrelay as a dependency.
  let nrelayLib: typeof nrelay;

  // try to get the project's nrelay dependency.
  const projectNrelay = cwd('node_modules', 'nrelay');
  try {
    nrelayLib = require(projectNrelay);
  } catch (err) {
    return Promise.reject(err);
  }

  if (args.build === true) {
    await build.run();
    delete args.build;
  }
  // create the env and runtime.
  const env = new nrelayLib.Environment(process.cwd());
  const runtime = new nrelayLib.Runtime(env);
  return runtime.run(args as any);
}
