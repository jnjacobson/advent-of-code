import { readFileSync } from 'fs';

const input = readFileSync('src/2022/4/input.txt', 'utf-8');

const lines = input
  .split('\n')
  .filter((line: string) => line.length > 0);

const getStartEndTuple = (section: string): [number, number] => (
  section.split('-').map((str) => +str) as [number, number]
)

const doContain = (sections1: string, sections2: string): boolean => {
  const [start1, end1] = getStartEndTuple(sections1);
  const [start2, end2] = getStartEndTuple(sections2);

  return (start1 <= start2 && end1 >= end2)
    || (start2 <= start1 && end2 >= end1);
}

const answerPart1 = lines
  .map((line: string): boolean => {
    const [ sections1, sections2 ] = line.split(',');

    return doContain(sections1, sections2);
  })
  .reduce((acc, val) => acc + +val, 0);

const doOverlap = (sections1: string, sections2: string): boolean => {
  const [start1, end1] = getStartEndTuple(sections1);
  const [start2, end2] = getStartEndTuple(sections2);

  return (start2 >= start1 && start2 <= end1)
    || (start1 >= start2 && start1 <= end2);
}

const answerPart2 = lines
  .map((line: string): boolean => {
    const [ sections1, sections2 ] = line.split(',');

    return doOverlap(sections1, sections2);
  })
  .reduce((acc, val) => acc + +val, 0);

console.log({
  answerPart1,
  answerPart2,
});
