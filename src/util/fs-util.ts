import * as fs from 'fs';

/**
 * Creates a new directory at the specified path.
 * @param path The path of the directory to create.
 */
export function mkdir(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) {
        process.nextTick(reject, err);
      } else {
        process.nextTick(resolve);
      }
    });
  });
}

/**
 * Writes the data to the specified file.
 * @param path The path of the file to write to.
 * @param data The data to write to the file.
 */
export function writeFile(path: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        process.nextTick(reject, err);
      } else {
        process.nextTick(resolve);
      }
    });
  });
}

/**
 * Copies the source file into the destination file.
 * @param src The source file.
 * @param dest The destination file.
 */
export function copyFile(src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (err) => {
      if (err) {
        process.nextTick(reject, err);
      } else {
        process.nextTick(resolve);
      }
    });
  });
}

/**
 * Reads the contents of the file as a utf8 string.
 * @param path The path of the file to read.
 */
export function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        process.nextTick(reject, err);
      } else {
        process.nextTick(resolve, data);
      }
    });
  });
}

/**
 * Reads the contents of the source file, applies the transformation
 * function to the contents, then writes the result to the destination file.
 * @param src The source file.
 * @param dest The destination file.
 * @param transform The transformation function.
 */
export function copyTransform(src: string, dest: string, transform: (str: string) => string): Promise<void> {
  return readFile(src).then((str) => {
    const transformed = transform(str);
    return writeFile(dest, transformed);
  });
}

/**
 * Checks the the given path exists.
 * @param path The path to check the existence of.
 */
export function exists(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          process.nextTick(resolve, false);
        } else {
          process.nextTick(reject, err);
        }
      } else {
        process.nextTick(resolve, true);
      }
    });
  });
}
