export const indexRE = /(^|.*\/)(index|readme)\.(md|js)$/i;

export function isIndexFile (file: string): boolean {
  return indexRE.test(file);
}
