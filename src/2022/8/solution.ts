import { readFileSync } from 'fs';

const trees: number[][] = readFileSync('src/2022/8/input.txt', 'utf-8')
  .split('\n')
  .map((line) => (
    line.split('')
      .map((tree) => Number.parseInt(tree))
  ));

const visibleTrees: Set<string> = new Set(); // "row,col"

const maxTreeHeightPerCol: number[] = Array(trees[0].length).fill(-1);

trees.forEach((line, row) => {
  let maxTreeHeightInLine = -1;

  line.forEach((treeHeight, col) => {
    let isVisible = false;

    if (treeHeight > maxTreeHeightInLine) {
      maxTreeHeightInLine = treeHeight;
      isVisible = true;
    }

    if (treeHeight > maxTreeHeightPerCol[col]) {
      maxTreeHeightPerCol[col] = treeHeight;
      isVisible = true;
    }

    if (isVisible) {
      visibleTrees.add([row, col].toString());
    }
  });
});

maxTreeHeightPerCol.fill(-1); // reset

[...trees].reverse().forEach((line, row) => {
  const reversedRow = (trees.length - 1) - row;
  let maxTreeHeightInLine = -1;

  [...line].reverse().forEach((treeHeight, col) => {
    const reversedCol = (line.length - 1) - col;
    let isVisible = false;

    if (treeHeight > maxTreeHeightInLine) {
      maxTreeHeightInLine = treeHeight;
      isVisible = true;
    }

    if (treeHeight > maxTreeHeightPerCol[reversedCol]) {
      maxTreeHeightPerCol[reversedCol] = treeHeight;
      isVisible = true;
    }

    if (isVisible) {
      visibleTrees.add([reversedRow, reversedCol].toString());
    }
  });
});

let maxScenicScore = 0;

// todo: part 2

console.log({
  answerPart1: visibleTrees.size,
  answerPart2: maxScenicScore,
});