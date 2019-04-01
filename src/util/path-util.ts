import * as path from 'path';

/**
 * The same as `path.join` but starts at `process.cwd()`.
 *
 * This function is equivalent to `path.join(process.cwd(), '...');`
 * @param parts The path parts.
 */
export function cwd(...parts: string[]): string {
  return path.join(process.cwd(), ...parts);
}
