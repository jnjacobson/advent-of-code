import { readFileSync } from 'fs';

const input = readFileSync('src/2022/3/input.txt', 'utf-8');

const rucksacks = input
  .split('\n')
  .filter((line: string) => line.length > 0);

const getItemPriority = (item: string): number => {
  const asciiToPriority = item.toLowerCase() === item
    ? 97 - 1
    : 65 - 27;

  return item.charCodeAt(0) - asciiToPriority;
}

const answerPart1 = rucksacks
  // split rucksack into the 2 compartments
  .map((rucksack: string): [string, string] => [
    rucksack.slice(0, rucksack.length / 2),
    rucksack.slice(rucksack.length / 2)
  ])
  // get priority of common item
  .map(([compartment1, compartment2]): number => {
    const item = compartment1
      .split('')
      .find((item: string) => compartment2.includes(item));

    if (item === undefined) {
      throw new Error('No common item found!');
    }

    return getItemPriority(item);
  })
  // sum priorities
  .reduce((acc, val) => acc + val, 0);


const answerPart2 = rucksacks
  // get groups of three
  .reduce((groups: string[][], rucksack: string): string[][] => {
    if (groups[groups.length - 1].length === 3) {
      groups.push([]); // last group is full, make new one
    }

    groups[groups.length - 1].push(rucksack);

    return groups;
  }, [])
  // get priority of common item
  .map(([rucksack1, rucksack2, rucksack3]) => {
    const item = rucksack1
      .split('')
      .find((item: string) => (
        rucksack2.includes(item) && rucksack3.includes(item)
      ));

    if (item === undefined) {
      throw new Error('No common item found!');
    }

    return getItemPriority(item);
  })
  // sum priorities
  .reduce((acc, val) => acc + val, 0);

console.log({
  answerPart1,
  answerPart2,
})
