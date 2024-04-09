import {
  isPathEmpty,
  pathBasename,
  pathExtension,
  pathJoin,
  pathSplit,
} from '../path';

describe('string > path', () => {
  test('pathJoin', () => {
    const inputP1 = './/abayomi/yomi';
    const inputP2 = 'fimidara/softkave//';
    const inputP3 = ['/nigeria', 'usa/', './/'];

    const output = pathJoin({input: [inputP1, inputP2, inputP3]});

    const expectedP = '/abayomi/yomi/fimidara/softkave/nigeria/usa';
    expect(output).toBe(expectedP);
  });

  test('pathJoin with empty input', () => {
    const inputP1 = '';
    const inputP2 = '../';
    const inputP3 = '.';

    const output01 = pathJoin({input: [inputP1, inputP1]});
    const output02 = pathJoin({input: [inputP1, inputP2]});
    const output03 = pathJoin({input: [inputP1, inputP3]});

    const expectedP01 = '';
    expect(output01).toBe(expectedP01);
    expect(output02).toBe(expectedP01);
    expect(output03).toBe(expectedP01);
  });

  test('pathJoin with . and ..', () => {
    const inputP1 = '/folder01';
    const inputP2 = '.././folder02';
    const inputP3 = '.';

    const output01 = pathJoin({input: [inputP1, inputP2, inputP3]});

    const expectedP01 = '/folder02';
    expect(output01).toBe(expectedP01);
  });

  test.skip('pathJoin with C://', () => {
    const inputP1 = 'C://folder01/folder02';

    const output01 = pathJoin({input: inputP1});

    const expectedP01 = '/folder01/folder02';
    expect(output01).toBe(expectedP01);
  });

  test('pathSplit', () => {
    const input = '///abayomi/fimidara/yomi//softkave//';

    const output = pathSplit({input});

    const expectP = ['abayomi', 'fimidara', 'yomi', 'softkave'];
    expect(output).toEqual(expectP);
  });

  test('pathSplit with . and ..', () => {
    const input01 = '///abayomi/fimidara/yomi//softkave//.././..';
    const input02 = '.././..';

    const output01 = pathSplit({input: input01});
    const output02 = pathSplit({input: input02});

    const expectP01 = ['abayomi', 'fimidara'];
    const expectP02: string[] = [];
    expect(output01).toEqual(expectP01);
    expect(output02).toEqual(expectP02);
  });

  test.skip('pathSplit with C://', () => {
    const input = 'C://abayomi/fimidara/yomi//softkave//';

    const output = pathSplit({input});

    const expectP = ['abayomi', 'fimidara', 'yomi', 'softkave'];
    expect(output).toEqual(expectP);
  });

  test('isPathEmpty', () => {
    const emptyP01 = '.';
    const emptyP02 = './';
    const emptyP03 = '/./';
    const emptyP04 = '//.//';
    const emptyP05 = '';
    const emptyP06 = [] as string[];
    const emptyP07 = [emptyP01, emptyP02, emptyP03, emptyP04, emptyP05];

    const notEmptyP01 = 'hello';
    const notEmptyP02 = 'hello/.';
    const notEmptyP03 = './hello/.';

    const isEmptyP01 = isPathEmpty({input: emptyP01});
    const isEmptyP02 = isPathEmpty({input: emptyP02});
    const isEmptyP03 = isPathEmpty({input: emptyP03});
    const isEmptyP04 = isPathEmpty({input: emptyP04});
    const isEmptyP05 = isPathEmpty({input: emptyP05});
    const isEmptyP06 = isPathEmpty({input: emptyP06});
    const isEmptyP07 = isPathEmpty({input: emptyP07});

    const isNotEmptyP01 = isPathEmpty({input: notEmptyP01});
    const isNotEmptyP02 = isPathEmpty({input: notEmptyP02});
    const isNotEmptyP03 = isPathEmpty({input: notEmptyP03});

    expect(isEmptyP01).toBeTruthy();
    expect(isEmptyP02).toBeTruthy();
    expect(isEmptyP03).toBeTruthy();
    expect(isEmptyP04).toBeTruthy();
    expect(isEmptyP05).toBeTruthy();
    expect(isEmptyP06).toBeTruthy();
    expect(isEmptyP07).toBeTruthy();

    expect(isNotEmptyP01).toBeFalsy();
    expect(isNotEmptyP02).toBeFalsy();
    expect(isNotEmptyP03).toBeFalsy();
  });

  test('pathExtension', () => {
    const input01 = './name.extension';
    const input02 = './name.second-name.EXTENSION';
    const input03 = './.gitignore';

    const ext01 = pathExtension({input: input01});
    const ext02 = pathExtension({input: input02});
    const ext03 = pathExtension({input: input03});

    expect(ext01).toBe('extension');
    expect(ext02).toBe('EXTENSION');
    expect(ext03).toBe('');
  });

  test('pathBasename', () => {
    const input01 = './name.extension';
    const input02 = './name.second-name.EXTENSION';
    const input03 = './.gitignore';
    const input04 = './.gitignore...ext';
    const input05 = '';
    const input06 = '.';
    const input07 = '..';

    const b01 = pathBasename({input: input01});
    const b02 = pathBasename({input: input02});
    const b03 = pathBasename({input: input03});
    const b04 = pathBasename({input: input04});
    const b05 = pathBasename({input: input05});
    const b06 = pathBasename({input: input06});
    const b07 = pathBasename({input: input07});

    expect(b01.basename).toBe('name');
    expect(b01.ext).toBe('extension');
    expect(b02.basename).toBe('name.second-name');
    expect(b02.ext).toBe('EXTENSION');
    expect(b03.basename).toBe('.gitignore');
    expect(b03.ext).toBe('');
    expect(b04.basename).toBe('.gitignore..');
    expect(b04.ext).toBe('ext');
    expect(b05.basename).toBe('');
    expect(b05.ext).toBe('');
    expect(b06.basename).toBe('');
    expect(b06.ext).toBe('');
    expect(b07.basename).toBe('');
    expect(b07.ext).toBe('');
  });
});
