function getPatterns(pattern) {
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
      patternToMatch = pattern[i];
      patternArr.push(patternToMatch);
      i++;
    }
  }

  return patternArr;
}

function matchPattern(inputLine, pattern) {
  const digits = '0123456789';
  const alphaNumbers =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

  const patternArr = getPatterns(pattern);

  let i = 0;
  while (i < inputLine.length) {
    let j = 0;

    while (j < patternArr.length) {
      const cursor = patternArr[j];
      const index = i + j;

      if (index >= inputLine.length) {
        break;
      }
      const inputCharacter = inputLine[index];

      if (cursor === '\\d' && digits.includes(inputCharacter)) {
        j++;
        continue;
      } else if (cursor === '\\w' && alphaNumbers.includes(inputCharacter)) {
        j++;
        continue;
      } else if (cursor.startsWith('[^')) {
        if (!cursor.slice(2, cursor.length - 1).includes(inputCharacter)) {
          j++;
          continue;
        } else {
          return false;
        }
      } else if (
        cursor.startsWith('[') &&
        cursor.slice(1, cursor.length - 1).includes(inputCharacter)
      ) {
        j++;
        continue;
      } else if (cursor.length === 1 && cursor === inputCharacter) {
        j++;
        continue;
      } else {
        break;
      }
    }

    if (j === patternArr.length) {
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
