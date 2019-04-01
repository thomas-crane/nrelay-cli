import * as path from 'path';

/**
 * Gets the full path to the specified asset file.
 * @param fileName The name of the asset file to get the path of.
 */
export function pathOf(fileName: string): string {
  return path.join(__dirname, '..', '..', 'assets', fileName);
}
