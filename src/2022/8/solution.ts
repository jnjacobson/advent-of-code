import { readFileSync } from 'fs';

const trees: number[][] = readFileSync('src/2022/8/input.txt', 'utf-8')
  .split('\n')
  .map((line) => (
    line.split('')
      .map((tree) => Number.parseInt(tree))
  ));

const visibleTrees: Set<string> = new Set(); // "row,col"

const highestTreePerCol: number[] = Array(trees[0].length).fill(-1);

trees.forEach((row, rowIdx) => {
  let maxTreeHeightInLine = -1;

  row.forEach((tree, colIdx) => {
    let isVisible = false;

    if (tree > maxTreeHeightInLine) {
      maxTreeHeightInLine = tree;
      isVisible = true;
    }

    if (tree > highestTreePerCol[colIdx]) {
      highestTreePerCol[colIdx] = tree;
      isVisible = true;
    }

    if (isVisible) {
      visibleTrees.add([rowIdx, colIdx].toString());
    }
  });
});

highestTreePerCol.fill(-1); // reset

[...trees].reverse().forEach((row, rowIdx) => {
  const reversedRowIdx = (trees.length - 1) - rowIdx;
  let highestTreeInRow = -1;

  [...row].reverse().forEach((tree, colIdx) => {
    const reversedColIdx = (row.length - 1) - colIdx;
    let isVisible = false;

    if (tree > highestTreeInRow) {
      highestTreeInRow = tree;
      isVisible = true;
    }

    if (tree > highestTreePerCol[reversedColIdx]) {
      highestTreePerCol[reversedColIdx] = tree;
      isVisible = true;
    }

    if (isVisible) {
      visibleTrees.add([reversedRowIdx, reversedColIdx].toString());
    }
  });
});

let maxScenicScore = 0;

const getColFromMatrix = <T>(arr: T[][], col: number): T[] => (
  arr.map((x) => x[col])
);

const getViewingDistance = (tree: number, otherTrees: number[]): number => {
  if (otherTrees.length === 0) {
    return 0;
  }

  const idx = otherTrees.findIndex((otherTree) => otherTree >= tree);

  return idx === -1 ? otherTrees.length : idx + 1;
}

trees.forEach((row, rowIdx) => (
  row.forEach((tree, colIdx) => {
    const col = getColFromMatrix(trees, colIdx);

    const scenicScore = getViewingDistance(tree, row.slice(0, colIdx).reverse()) // left
      * getViewingDistance(tree, row.slice(colIdx + 1)) // right
      * getViewingDistance(tree, col.slice(0, rowIdx).reverse()) // up
      * getViewingDistance(tree, col.slice(rowIdx + 1)); // down

    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore;
    }
  })
));

console.log({
  answerPart1: visibleTrees.size,
  answerPart2: maxScenicScore,
});