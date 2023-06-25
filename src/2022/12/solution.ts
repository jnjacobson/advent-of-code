import { getDiffieHellman } from 'crypto';
import { readFileSync } from 'fs';

function addAdjacents(adjacents: number[][], squares: string[][], row: number, col: number) {
  const rowLen = squares[row].length;
  const srcId = getSquareId(rowLen, row, col);

  // left
  if (isTraversable(squares[row][col], squares?.[row-1]?.[col])) {
    adjacents[srcId].push(getSquareId(rowLen, row-1, col));
  }

  // right
  if (isTraversable(squares[row][col], squares?.[row+1]?.[col])) {
    adjacents[srcId].push(getSquareId(rowLen, row+1, col));
  }

  // top
  if (isTraversable(squares[row][col], squares[row]?.[col-1])) {
    adjacents[srcId].push(getSquareId(rowLen, row, col-1));
  }

  // down
  if (isTraversable(squares[row][col], squares[row]?.[col+1])) {
    adjacents[srcId].push(getSquareId(rowLen, row, col+1));
  }
}

function isTraversable(from: string, to: string | undefined) {
  if (to === undefined) {
    return false;
  }

  return from.charCodeAt(0) >= to.charCodeAt(0) - 1;
}

function getSquareId(rowLen: number, row: number, col: number) {
  return rowLen * row + col;
}

function getDistancesFromSrc(startId: number, adjacents: number[][]) {
  const distancesFromSrc = new Array(squareCount);
  distancesFromSrc[startId] = 0;

  const queue = [startId];

  for (let current; (current = queue.shift()) !== undefined;) {
    for (const adjacent of adjacents[current]) {
      if (distancesFromSrc[adjacent] !== undefined) {
        continue;
      }

      queue.push(adjacent);
      distancesFromSrc[adjacent] = distancesFromSrc[current] + 1;
    }
  }

  return distancesFromSrc;
}

const squares = readFileSync('src/2022/12/input.txt', 'utf-8')
  .split('\n')
  .map((line) => line.split(''));
const squareCount = squares.length * squares[0].length;

const adjacents: number[][] = Array.from(new Array(squareCount), () => []);

let startId: number | undefined = undefined;
let endId: number | undefined = undefined;
const lowestElevationSquareIds = []

for (let row = 0; row < squares.length; row++) {
  const rowLen = squares[row].length;

  for (let col = 0; col < rowLen; col++) {
    if (squares[row][col] === 'S') {
      startId = getSquareId(rowLen, row, col);
      squares[row][col] = 'a';
    } else if (squares[row][col] === 'E') {
      endId = getSquareId(rowLen, row, col);
      squares[row][col] = 'z';
    }

    addAdjacents(adjacents, squares, row, col);

    if (squares[row][col] === 'a') {
      lowestElevationSquareIds.push(getSquareId(rowLen, row, col));
    }
  }
}

if (startId === undefined || endId === undefined) throw Error();

const distancesFromSrc = getDistancesFromSrc(startId, adjacents);

console.log({
  answerPart1: distancesFromSrc[endId],
});

let minDist = distancesFromSrc[endId];

for (const squareId of lowestElevationSquareIds) {
  const distances = getDistancesFromSrc(squareId, adjacents);
  if (distances[endId] < minDist) {
    minDist = distances[endId];
  }
}

console.log({
  answerPart2: minDist,
});
