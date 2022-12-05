import { readFileSync } from 'fs';

const lines = readFileSync('src/2022/5/input.txt', 'utf-8')
  .split('\n');

const stacks: string[][] = lines
  // remove lines that contain no crates
  .filter((line) => line.length > 0 && (line[0] === '[' || line.substring(0, 2) === '  '))
  // reverse to start at the bottom of the stacks
  .reverse()
  // get crates from each line and push them into its stack array
  .reduce((stacks, line) => {
    line.split('')
      .forEach((char, idx) => {
        if ((idx - 1) % 4 || char === ' ') { // not a crate
          return stacks;
        }

        const stackIdx = (idx - 1) / 4;

        if (stacks[stackIdx] === undefined) {
          stacks[stackIdx] = [];
        }

        stacks[stackIdx].push(char);
      });

    return stacks;
  }, [] as string[][]);

interface Move {
  count: number,
  from: number,
  to: number,
}

const moves: Move[] = lines
  // get only move lines
  .filter((line) => line[0] === 'm')
  // map move string to move
  .map((line): Move => {
    const [
      count,
      from,
      to,
    ] = line.split(' ')
      .map((str) => Number.parseInt(str))
      .filter((nr) => Number.isInteger(nr));

    return {
      count,
      from: from - 1,
      to: to - 1,
    };
  });

const getTopCrates = (stacks: string[][]): string => (
  stacks.reduce((topCrates, stack) => (
    topCrates.concat(stack[stack.length - 1] ?? '')
  ), '')
);

const stacksCopy1 = JSON.parse(JSON.stringify(stacks));
moves.forEach((move) => {
  for (let i = 0; i < move.count; i++) {
    const crate = stacksCopy1[move.from].pop();

    if (crate === undefined) {
      throw new Error('This stack is empty, sire.');
    }

    stacksCopy1[move.to].push(crate);
  }
});
const solutionPart1 = getTopCrates(stacksCopy1);

const stacksCopy2 = JSON.parse(JSON.stringify(stacks));
moves.forEach((move) => {
  const from = stacksCopy2[move.from];
  const crates = from.splice(from.length - move.count);

  stacksCopy2[move.to].push(...crates);
});
const solutionPart2 = getTopCrates(stacksCopy2);

console.log({
  solutionPart1,
  solutionPart2,
});
