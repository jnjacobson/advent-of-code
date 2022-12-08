import { readFileSync } from 'fs';

const input = readFileSync('src/2022/1/input.txt', 'utf-8');

const sortedElves = input
  .split('\n\n')
  .map((elf) => (
    elf.split('\n')
      .reduce((acc, val) => acc + +val , 0)
  ))
  .sort((n1,n2) => n2 - n1);

const answerPart1 = sortedElves[0];

const answerPart2 = sortedElves
  .slice(0, 3)
  .reduce((acc, val) => acc + val, 0);

console.log({
  answerPart1,
  answerPart2,
});
