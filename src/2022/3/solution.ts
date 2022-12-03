import { readFileSync } from 'fs';

const input = readFileSync('src/2022/3/input.txt', 'utf-8');

const lines = input
  .split('\n')
  .filter((line: string) => line.length > 0);

const getItemPriority = (item: string): number => {
  const asciiToPriority = item.toLowerCase() === item
    ? 97 - 1
    : 65 - 27;

  return item.charCodeAt(0) - asciiToPriority;
}

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

    return getItemPriority(item);
  })
  .reduce((acc, val) => acc + val, 0);


const solutionPart2 = lines
  .reduce((triples, val): string[][] => {
    if (triples[triples.length - 1].length === 3) {
      triples.push([]); // last triple is full, make new one
    }

    triples[triples.length - 1].push(val);

    return triples;
  }, [[]] as string[][])
  .map(([inv1, inv2, inv3]) => {
    const item = inv1
      .split('')
      .find((item: string) => inv2.includes(item) && inv3.includes(item));

    if (item === undefined) {
      throw new Error('No common item found!');
    }

    return getItemPriority(item);
  })
  .reduce((acc, val) => acc + val, 0);

console.log({
  solutionPart1,
  solutionPart2,
})
