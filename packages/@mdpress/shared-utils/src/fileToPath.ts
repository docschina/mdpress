import { indexRE, isIndexFile } from './isIndexFile';

const extRE = /\.(js|md)$/;

export = function fileToPath (file: string): string {
  if (isIndexFile(file)) {
    // README.md -> /
    // README.js -> /
    // foo/README.md -> /foo/
    // foo/README.js -> /foo/
    return file.replace(indexRE, '/$1');
  } else {
    // foo.md -> /foo.html
    // foo.js -> /foo.html
    // foo/bar.md -> /foo/bar.html
    // foo/bar.js -> /foo/bar.html
    return `/${file.replace(extRE, '').replace(/\\/g, '/')}.html`;
  }
}
