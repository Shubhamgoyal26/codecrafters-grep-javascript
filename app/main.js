const digits = '0123456789';
const alphaNumbers =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

function parsePattern(pattern) {
  let patternArr = [];
  let i = 0;
  let patternToMatch = '';

  while (i < pattern.length) {
    if (pattern[i] === '\\') {
      patternToMatch = pattern.slice(i, i + 2);
      if (patternToMatch[1] !== 'd' && patternToMatch[1] !== 'w') {
        throw new Error(`Unhandled pattern ${pattern}`);
      }
      patternArr.push(patternToMatch);
      i += 2;
    } else if (pattern[i] === '[') {
      let j = i;

      while (j < pattern.length) {
        if (pattern[j] === ']') {
          patternToMatch = pattern.slice(i, j + 1);
          patternArr.push(patternToMatch);
          j++;
          break;
        }

        if (j === pattern.length - 1) {
          throw new Error(`Unhandled pattern ${pattern}`);
        }

        j++;
      }

      i = j;
    } else {
      if (pattern[i + 1] === '+') {
        patternToMatch = pattern.slice(i, i + 2);
        i += 2;
      } else {
        patternToMatch = pattern[i];
        i++;
      }
      patternArr.push(patternToMatch);
    }
  }

  return patternArr;
}

function matchPatternHere(inputLine, patternArr) {
  let i = 0;
  let j = 0;

  while (i < patternArr.length) {
    const cursor = patternArr[i++];
    const inputCharacter = inputLine[j++];

    if (cursor === '\\d' && digits.includes(inputCharacter)) {
      continue;
    } else if (cursor === '\\w' && alphaNumbers.includes(inputCharacter)) {
      continue;
    } else if (cursor.startsWith('[^')) {
      // cannot put this condition with "[^" condition as any pattern which starts with "[^" but also includes the inputCharacter
      // in pattern string will then evaluate to false thus going to the next condition and become true since the pattern does
      // start with "[" and also includes the inputCharacter in pattern string
      if (!cursor.slice(2, cursor.length - 1).includes(inputCharacter)) {
        continue;
      } else {
        i--;
        break;
      }
    } else if (
      cursor.startsWith('[') &&
      cursor.slice(1, cursor.length - 1).includes(inputCharacter)
    ) {
      continue;
    } else if (cursor.length === 2 && cursor[1] === '+') {
      if (inputCharacter !== cursor[0]) {
        i--;
        break;
      }
      while (inputLine[j] === cursor[0]) {
        j++;
      }
      continue;
    } else if (cursor.length === 1 && cursor === inputCharacter) {
      continue;
    } else {
      i--;
      break;
    }
  }

  if (
    patternArr.slice(-1)[0] === '$' &&
    i === patternArr.length - 1 &&
    j === inputLine.length + 1
  ) {
    return true;
  }

  if (i === patternArr.length) {
    return true;
  } else {
    return false;
  }
}

function matchPattern(inputLine, pattern) {
  const patternArr = parsePattern(pattern);

  if (patternArr[0] === '^') {
    return matchPatternHere(inputLine, patternArr.slice(1));
  }

  let i = 0;
  while (i < inputLine.length) {
    let res = matchPatternHere(inputLine.slice(i), patternArr);
    if (res === true) {
      return true;
    }
    i++;
  }

  return false;
}

function main() {
  const pattern = process.argv[3];
  const inputLine = require('fs').readFileSync(0, 'utf-8').trim();

  if (process.argv[2] !== '-E') {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  console.log('Logs from your program will appear here');

  // Uncomment this block to pass the first stage
  if (matchPattern(inputLine, pattern)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
