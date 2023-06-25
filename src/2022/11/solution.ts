import { readFileSync } from 'fs';

type Monkey = {
  items: number[],
  operation: (item: number, divisorProduct?: number) => number,
  getMonkeyToThrowTo: (item: number) => number,
  inspectionCount: number,
  divisor: number,
};

function parseItems(itemsLine: string): number[] {
  return itemsLine.split(':')[1].split(', ').map((str) => Number.parseInt(str, 10))
}

function parseOperation(operationLine: string): (item: number, divisorProduct?: number) => number {
  const words = operationLine.split(' ').filter((str) => str.length > 0);

  const operator = words[4];
  const operand = Number.parseInt(words[5], 10);

  return (item: number, divisorProduct?: number) => {
    let newItem: number;

    if (divisorProduct) {
      item %= divisorProduct;
    }
    
    const cleanedOperand = Number.isNaN(operand) ? item : operand;

    switch (operator) {
      case '+':
        newItem = item + cleanedOperand;
        break;
      case '*':
        newItem = item * cleanedOperand;
        break;
      default:
        throw new Error('Unsupported operation');
    }

    if (divisorProduct) {
      return newItem;
    }
   
    return Math.floor(newItem / 3);
  }
}

function extractNumberFromString(str: string): number {
  const matches = str.match(/\d+/);

  if (matches === null) {
    throw new Error();
  }

  return Number.parseInt(matches[0], 10);
}

function parseTest(
  testLine: string,
  trueLine: string,
  falseLine: string,
): (item: number) => number {
  const divisor = extractNumberFromString(testLine);
  const monkeyIdTrue = extractNumberFromString(trueLine);
  const monkeyIdFalse = extractNumberFromString(falseLine);

  return (item: number) => (
    item % divisor === 0
      ? monkeyIdTrue
      : monkeyIdFalse
  );
}

function playRounds(count: number, monkeys: Monkey[], divideWorry: boolean = false): void {
  let divisorProduct: number|undefined = undefined;
  if (!divideWorry) {
    divisorProduct = monkeys.map((monkey) => monkey.divisor).reduce(((acc, val) => acc * val), 1);
  }

  for (let round = 0; round < count; round++) {
    for (let i = 0; i < monkeys.length; i++) {

      const itemCount = monkeys[i].items.length;
      for (let j = 0; j < itemCount; j++) {
        const item = monkeys[i].items.shift();

        if (item === undefined) throw new Error();

        const newItem = monkeys[i].operation(item, divisorProduct);
        monkeys[i].inspectionCount++;

        const monkeyToThrowTo = monkeys[i].getMonkeyToThrowTo(newItem);

        monkeys[monkeyToThrowTo].items.push(newItem);
      }
    }
  }
}

const part1Monkeys: Monkey[] = readFileSync('src/2022/11/input.txt', 'utf-8')
  .split('\n\n')
  .map((monkeyStr: string): Monkey => {
    const lines = monkeyStr.split('\n');
    
    return {
      items: parseItems(lines[1]),
      operation: parseOperation(lines[2]),
      getMonkeyToThrowTo: parseTest(lines[3], lines[4], lines[5]),
      inspectionCount: 0,
      divisor: extractNumberFromString(lines[3]),
    };
  });

playRounds(20, part1Monkeys, true);

part1Monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);

console.log({
  answerPart1: part1Monkeys[0].inspectionCount * part1Monkeys[1].inspectionCount,
});

const part2Monkeys: Monkey[] = readFileSync('src/2022/11/input.txt', 'utf-8')
  .split('\n\n')
  .map((monkeyStr: string): Monkey => {
    const lines = monkeyStr.split('\n');
    
    return {
      items: parseItems(lines[1]),
      operation: parseOperation(lines[2]),
      getMonkeyToThrowTo: parseTest(lines[3], lines[4], lines[5]),
      inspectionCount: 0,
      divisor: extractNumberFromString(lines[3]),
    };
  });

playRounds(10_000, part2Monkeys, false);

part2Monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);

console.log({
  answerPart2: part2Monkeys[0].inspectionCount * part2Monkeys[1].inspectionCount,
})

