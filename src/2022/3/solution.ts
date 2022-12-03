import { readFileSync } from 'fs';

const input = readFileSync('src/2022/3/input.txt', 'utf-8');

const lines = input
  .split('\n')
  .filter((line: string) => line.length > 0);

const solutionPart1 = lines
  .map((line: string): [string, string] => [
    line.slice(0, line.length / 2),
    line.slice(line.length / 2)
  ])
  .map(([compartment1, compartment2]): number => {
    const item = compartment1
      .split('')
      .find((item: string) => compartment2.includes(item));

    if (item === undefined) {
      throw new Error('No common item found!');
    }

    const asciiToPriority = item.toLowerCase() === item
      ? 97 - 1
      : 65 - 27;

    return item.charCodeAt(0) - asciiToPriority;
  })
  .reduce((acc, val) => acc + val, 0);

console.log({
  solutionPart1,
})
