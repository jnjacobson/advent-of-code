import { readFileSync } from 'fs';

enum Result {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

class Shape {
  private static readonly ROCK = new Shape(1);
  private static readonly PAPER = new Shape(2);
  private static readonly SCISSORS = new Shape(3);

  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public getValue() {
    return this.value;
  }

  public static parseValue(value: number): Shape {
    switch (value) {
      case 1:
        return Shape.ROCK;
      case 2:
        return Shape.PAPER;
      case 3:
        return Shape.SCISSORS;
      default:
        throw new Error(`${value} is not a valid value!`);
    }
  }

  public static parseEncrypted(encrypted: string): Shape {
    switch (encrypted) {
      case 'A':
      case 'X':
        return Shape.ROCK;
      case 'B':
      case 'Y':
        return Shape.PAPER;
      case 'C':
      case 'Z':
        return Shape.SCISSORS;
      default:
        throw new Error();
    }
  }

  public static parseEncryptedPart2(encrypted: string, opponent: Shape): Shape {
    switch (encrypted) {
      case 'X': // lose
        return Shape.parseValue(opponent.getValue() - 1 === 0 ? 3 : opponent.getValue() - 1)
      case 'Y': // draw
        return opponent;
      case 'Z': // win
        return Shape.parseValue(opponent.getValue() % 3 + 1);
      default:
        throw new Error();
    }
  }

  public vs(opponent: Shape): Result {
    if (this.value === opponent.getValue()) {
      return Result.Draw;
    }

    if (this.value % 3 === (opponent.getValue() + 1) % 3) {
      return Result.Win;
    }

    return Result.Lose;
  }
}

const input = readFileSync('src/2022/2/input.txt', 'utf-8');

const lines = input.split('\n')

const solutionPart1 = lines
  .map((line) => {
    if (line.length < 3) {
      return 0;
    }

    const opponent = Shape.parseEncrypted(line.substring(0, 1));
    const player = Shape.parseEncrypted(line.substring(2, 3));

    return player.vs(opponent) + player.getValue();
  })
  .reduce((acc, val) => acc + val, 0);

const solutionPart2 = lines
  .map((line) => {
    if (line.length < 3) {
      return 0;
    }

    const opponent = Shape.parseEncrypted(line.substring(0, 1));
    const player = Shape.parseEncryptedPart2(line.substring(2, 3), opponent);

    return player.vs(opponent) + player.getValue();
  })
  .reduce((acc, val) => acc + val, 0);

console.log({
  solutionPart1,
  solutionPart2,
});
