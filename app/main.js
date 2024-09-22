function matchPattern(inputLine, pattern) {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else if (pattern === '\\d') {
    let digits = '0123456789';

    for (let i = 0; i < inputLine.length; i++) {
      if (digits.includes(inputLine[i])) {
        return true;
      }
    }

    return false;
  } else if (pattern === '\\w') {
    let alphaNumbers =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

    for (let i = 0; i < inputLine.length; i++) {
      if (alphaNumbers.includes(inputLine[i])) {
        return true;
      }
    }

    return false;
  } else if (
    pattern.slice(0, 2) === '[^' &&
    pattern[pattern.length - 1] === ']'
  ) {
    let patternToMatch = pattern.slice(2, -1);

    for (let i = 0; i < inputLine.length; i++) {
      if (patternToMatch.includes(inputLine[i])) {
        return false;
      }
    }

    return true;
  } else if (pattern[0] === '[' && pattern[pattern.length - 1] === ']') {
    let patternToMatch = pattern.slice(1, -1);

    for (let i = 0; i < inputLine.length; i++) {
      if (patternToMatch.includes(inputLine[i])) {
        return true;
      }
    }

    return false;
  } else {
    throw new Error(`Unhandled pattern ${pattern}`);
  }
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
