import parseHeaders from '../src/parseHeaders';

describe('parseHeaders', () => {
  test('should unescape html', () => {
    const input = '&lt;div&gt;';
    expect(parseHeaders(input)).toBe('<div>');
  });

  test('should remove markdown tokens correctly', () => {
    const asserts: Record<string, string> = {
      // #238
      '[react](reactjs.org)': 'react',
      '`react`': 'react',
      '*react*': 'react',
      '**react**': 'react',
      '***react***': 'react',
      '_react_': 'react',
      '\\_react\\_': '_react_',
      '\\*react\\*': '*react*',
      '\\!react\\!': '!react!',

      // #564 For multiple markdown tokens
      '`a` and `b`': 'a and b',
      '***bold and italic***': 'bold and italic',
      '**bold** and *italic*': 'bold and italic'
    };
    Object.keys(asserts).forEach(input => {
      expect(parseHeaders(input)).toBe(asserts[input]);
    });
  });
});
