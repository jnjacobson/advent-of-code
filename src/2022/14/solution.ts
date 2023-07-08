import { readFileSync } from 'fs';

enum Material {
  Air,
  Rock,
  Sand,
}

function getPathBetween(pointA: [number, number], pointB: [number, number]): [number, number][] {
  const xOffset = pointB[0] - pointA[0];
  const yOffset = pointB[1] - pointA[1];

  const maxAbsOffset = Math.max(Math.abs(xOffset), Math.abs(yOffset));
  const xStep = xOffset / maxAbsOffset;
  const yStep = yOffset / maxAbsOffset;

  const pathBetween = <[number, number][]>[];

  for (let i = 0; i <= maxAbsOffset; i++) {
    pathBetween.push([
      pointA[0] + xStep * i,
      pointA[1] + yStep * i,
    ]);
  }

  return pathBetween;
}

function dropSand(coordinateSystem: Material[][], x: number, y: number): [number, number] | null {
  if (coordinateSystem[x]?.[y + 1] === undefined) {
    return null; // abyss
  }

  if (coordinateSystem[x][y + 1] === Material.Air) { // down
    return dropSand(coordinateSystem, x, y + 1)
  }

  if (coordinateSystem[x - 1][y + 1] === Material.Air) { // down-left
    return dropSand(coordinateSystem, x - 1, y + 1);
  }

  if (coordinateSystem[x + 1][y + 1] === Material.Air) { // down-right
    return dropSand(coordinateSystem, x + 1, y + 1);
  }

  return [x, y];
}

// read paths
const paths = readFileSync('src/2022/14/input.txt', 'utf-8')
  .split('\n')
  .map((rawPath: string): [number, number][] => (
    rawPath.split(' -> ').map((rawCoords: string): [number, number] => (
      rawCoords.split(',').map(
        (rawCoord): number => Number.parseInt(rawCoord),
      ) as [number, number]
    ))
  ));

const highestY = paths.flat().reduce((highestY, coordinates) => (
  coordinates[1] > highestY ? coordinates[1] : highestY
), 0);

console.log({highestY});

// init empty coordinate system
const part1CoordinateSystem: Material[][] = Array.from(new Array(2000), () => Array.from(new Array(1 + highestY + 2), () => Material.Air));

// draw rock paths into coordinate system
for (const path of paths) {
  for (let i = 0; i < path.length - 1; i++) {
    getPathBetween(path[i], path[i + 1]).forEach((point) => {
      part1CoordinateSystem[point[0]][point[1]] = Material.Rock;
    });
  }
}

const part2CoordinateSystem = part1CoordinateSystem.map((row) => row.slice());

// part 1
let sandCount = 0;
let endpoint: [number, number] | null = null;
while ((endpoint = dropSand(part1CoordinateSystem, 500, 0)) !== null) {
  sandCount++;

  part1CoordinateSystem[endpoint[0]][endpoint[1]] = Material.Sand;
}

console.log({
  anwerPart1: sandCount,
});

// part 2
part2CoordinateSystem.forEach((row) => {
  row[highestY + 2] = Material.Rock;
});

sandCount = 0;
endpoint = null;
while (endpoint?.[0] !== 500 || endpoint?.[1] !== 0) {
  endpoint = dropSand(part2CoordinateSystem, 500, 0);
  if (endpoint === null) {
    throw new Error('Sand should not fall into void in part 2!');
  }

  sandCount++;

  part2CoordinateSystem[endpoint[0]][endpoint[1]] = Material.Sand;
}

console.log({
  anwerPart2: sandCount,
});
