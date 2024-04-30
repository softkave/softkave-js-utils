import {expect, test} from 'vitest';
import {multilineTextToParagraph} from '../multilineTextToParagraph.js';

test('multilineTextToParagraph', () => {
  const startText = `
    Resource type permission is effected on. 
    Target ID or other target identifiers like folderpath 
    should be provided when using target type to limit from 
  `;
  const expectedText =
    'Resource type permission is effected on. Target ID or other target identifiers like folderpath should be provided when using target type to limit from';
  const resultText = multilineTextToParagraph(startText);
  expect(resultText).toBe(expectedText);
});
