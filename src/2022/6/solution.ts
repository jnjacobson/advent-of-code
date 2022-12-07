import { readFileSync } from 'fs';

const inputStr = readFileSync('src/2022/6/input.txt', 'utf-8');

const findMarkerPos = (str: string, markerLen: number): number => {
  for (let i = markerLen; i < str.length; i++) {
    const isMarker = str
      .slice(i - markerLen, i)
      .split('')
      .every((char, j, possibleMarker) => (
        !possibleMarker.includes(char, j + 1)
      ));

    if (isMarker) {
      return i;
    }
  }

  throw Error('No marker found!');
}

console.log({
  solutionPart1: findMarkerPos(inputStr, 4),
  solutionPart2: findMarkerPos(inputStr, 14),
})
