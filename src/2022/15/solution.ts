import { readFileSync } from 'fs';

type Point = {
  x: number,
  y: number,
}

type Beacon = Point;

type Sensor = Point & {
  nearestBeacon: Beacon,
};

function isEqual(pointA: Point, pointB: Point): boolean {
  return pointA.x === pointB.x && pointA.y === pointB.y;
}

function getManhattanDistance(pointA: Point, pointB: Point): number {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

function isInsideManhattanRadius(center: Point, radius: number, point: Point): boolean {
  return getManhattanDistance(center, point) <= radius;
}

function getAllPointsAtManhattanDistance(point: Point, distance: number) {
  const points = <Point[]>[];

  let x = point.x - distance;
  let y = point.y;

  for (let i = 0; i < distance * 2; i++) {
    points.push(...[
      { 
        x: x + i,
        y: i < distance
          ? y + i
          : y + distance - (i - distance),
      },
      {
        x: x + i,
        y: i < distance
          ? y - i
          : y - distance - (i - distance),
      },
    ]);
  }

  return points;
}

function getTuningFrequency(beacon: Beacon) {
  return beacon.x * 4_000_000 + beacon.y;
}

// read paths
const sensors = readFileSync('src/2022/15/input.txt', 'utf-8')
  .split('\n')
  .map((report: string): Sensor => {
    const coordinates = [...report.match(/-?(\d+)/g) ?? []];
    if (coordinates.length !== 4) throw new Error('Report should contain exactly 4 coordinates!')

    const beacon = {
      x: Number.parseInt(coordinates[2]),
      y: Number.parseInt(coordinates[3]),
    };
    
    return <Sensor>{
      x: Number.parseInt(coordinates[0]),
      y: Number.parseInt(coordinates[1]),
      nearestBeacon: beacon,
    };
  });

const Y = 2_000_000;

const minX = sensors.reduce((min, sensor) => {
  const sensorRadius = getManhattanDistance(sensor, sensor.nearestBeacon);

  return Math.min(min, sensor.x - sensorRadius);
}, Number.MAX_SAFE_INTEGER);

const maxX = sensors.reduce((max, sensor) => {
  const sensorRadius = getManhattanDistance(sensor, sensor.nearestBeacon);

  return Math.max(max, sensor.x + sensorRadius);
}, Number.MIN_SAFE_INTEGER);

let cannotContainBeaconCount = 0;
for (const currentPoint = { x: minX, y: Y }; currentPoint.x < maxX; currentPoint.x++) {
  let canContainBeacon = true;

  for (const sensor of sensors) {
    if (isEqual(currentPoint, sensor)) {
      canContainBeacon = false;
      break;
    }

    if (isEqual(currentPoint, sensor.nearestBeacon)) {
      canContainBeacon = true;
      break;
    }

    const sensorRadius = getManhattanDistance(sensor, sensor.nearestBeacon);
    if (isInsideManhattanRadius(sensor, sensorRadius, currentPoint)) {
      canContainBeacon = false;
      break;
    }
  }

  if (!canContainBeacon) {
    cannotContainBeaconCount++;
  }
}

console.log({
  answerPart1: cannotContainBeaconCount,
});

const X_MAX = 4_000_000, Y_MAX = 4_000_000;

let distressBeacon;

for (const sensor of sensors) {
  const sensorRadius = getManhattanDistance(sensor, sensor.nearestBeacon);
  const pointsJustOutsideSensorRadius = getAllPointsAtManhattanDistance(sensor, sensorRadius + 1)

  distressBeacon = pointsJustOutsideSensorRadius.find((point) => {
    if (point.x < 0 || point.x > X_MAX || point.y < 0 || point.y > Y_MAX) {
      return false;
    }

    return !sensors.some((s) => (
      isInsideManhattanRadius(s, getManhattanDistance(s, s.nearestBeacon), point)
    ));
  })

  if (distressBeacon !== undefined) {
    break;
  }
}

if (distressBeacon === undefined) {
  throw new Error('No beacon found!');
}

console.log({
  answerPart2: getTuningFrequency(distressBeacon),
});
