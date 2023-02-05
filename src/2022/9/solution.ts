import { readFileSync } from 'fs';

enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R',
}

type Motion = {
  direction: Direction;
  steps: number;
}

class Point {
  protected x: number;
  protected y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getPosition(): [number, number] {
    return [this.x, this.y];
  }

  public getVector(otherPoint: Point): Point {
    const [otherX, otherY] = otherPoint.getPosition();

    return new Point(
      otherX - this.x,
      otherY - this.y,
    );
  }
}

class HeadKnot extends Point {
  public moveStep(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.y++;
        break;
      case Direction.Down:
        this.y--;
        break;
      case Direction.Left:
        this.x--;
        break;
      case Direction.Right:
        this.x++;
        break;
    }
  }
}

class Knot extends Point {
  public follow(point: Point) {
    const [diffX, diffY] = this.getVector(point).getPosition();

    if (Math.abs(diffX) > 2 || Math.abs(diffY) > 2) {
      throw new Error('Two knots are too far from each other!')
    }

    if (Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {
      return; // still touching
    }

    if (diffX === 0) {
      this.y += diffY > 0 ? 1 : -1;
      return;
    }

    if (diffY === 0) {
      this.x += diffX > 0 ? 1 : -1;
      return;
    }

    this.y += diffY > 0 ? 1 : -1;
    this.x += diffX > 0 ? 1 : -1;
  }
}

class Rope {
  private head: HeadKnot;
  private knots: Knot[] = [];

  constructor(knotCount: number) {
    if (knotCount < 1) {
      throw new Error('Rope must have at least one knot!');
    }

    this.head = new HeadKnot(0, 0);

    for (let i = 0; i < knotCount - 1; i++) {
      this.knots.push(new Knot(0, 0));
    }
  }

  public moveStep(direction: Direction) {
    this.head.moveStep(direction);

    this.knots.forEach((knot, idx) => {
      const predecessor = idx === 0 ? this.head : this.knots[idx - 1];

      knot.follow(predecessor);
    })
  }

  public getTailPosition(): [number, number] {
    return this.knots[this.knots.length - 1].getPosition();
  }
}

const motions: Motion[] = readFileSync('src/2022/9/input.txt', 'utf-8')
  .split('\n')
  .map((rawMotion) => {
    const [direction, steps] = rawMotion.split(' ');

    return <Motion>{
      direction,
      steps: Number.parseInt(steps),
    };
  });

const part1Rope = new Rope(2);
const part2Rope = new Rope(10);

// save init position 0,0
const part1TailPositions = new Set<string>([part1Rope.getTailPosition().toString()]);
const part2TailPositions = new Set<string>([part2Rope.getTailPosition().toString()]);

motions.forEach(({ direction, steps }) => {
  for (let i = 0; i < steps; i++) {
    part1Rope.moveStep(direction);
    part1TailPositions.add(part1Rope.getTailPosition().toString());

    part2Rope.moveStep(direction);
    part2TailPositions.add(part2Rope.getTailPosition().toString());
  }
});

console.log({
  answerPart1: part1TailPositions.size,
  answerPart2: part2TailPositions.size,
});
