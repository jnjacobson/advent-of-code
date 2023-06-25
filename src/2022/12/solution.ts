import { readFileSync } from 'fs';

function isTraversable(from: string, to: string) {
  return from.charCodeAt(0) >= to.charCodeAt(0) - 1;
}

function addAdjacentToEdges(squares: string[][], )

const squares = readFileSync('src/2022/12/input.txt', 'utf-8')
  .split('\n')
  .map((line) => line.split(''));

console.log(squares[0]);

// for each square
//   for each adjacent
//     if (isTraversable(sq, adj))
//       edges[sq].push(adj)

for (let x = 0; x < squares.length; x++) {
  for (let y = 0; y < squares.length; y++) {
    addAdjacentToEdges(squares, x, y);
  }
}
