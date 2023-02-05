import { readFileSync } from 'fs';

type AddXInstruction = {
   value: number;
}

class CPU {
  pc: number;
  cir: AddXInstruction | undefined;
  x: number;

  program: string[];

  public constructor(program: string[]) {
    this.x = 1;
    this.pc = 0;
    this.program = program;
  }

  public clockCycle(): void {
    if (this.cir !== undefined) {
      this.x += this.cir.value;
      this.cir = undefined;

      return;
    }

    if (this.pc === this.program.length) {
      throw new Error('End of program reached!');
    }

    const [instruction, value] = this.program[this.pc].split(' ');

    switch (instruction) {
      case 'addx':
        this.cir = <AddXInstruction>{
          value: Number.parseInt(value),
        };
        break;
      case 'noop':
        break; // no operations
      default:
        throw new Error('Unrecognized instruction!');
    }

    this.pc++;
  }
}

const program: string[] = readFileSync('src/2022/10/input.txt', 'utf-8')
  .split('\n');

const part1Cpu = new CPU(program);

let signalStrengthSum = 0;

for (let cycle = 1; cycle <= 220; cycle++) {
  if ((cycle - 20) % 40 === 0) {
    signalStrengthSum += part1Cpu.x * cycle;
  }

  part1Cpu.clockCycle()
}

console.log({
  answerPart1: signalStrengthSum,
});

class CRT {
  private static SCREEN_WIDTH = 40;
  private static SCREEN_HEIGHT = 6;

  cpu: CPU;
  screen: boolean[][];
  pc: number;

  public constructor(cpu: CPU) {
    this.cpu = cpu;
    this.screen = Array(CRT.SCREEN_HEIGHT).fill(null).map(() => []);

    this.pc = 0;
  }

  public clockCycle() {
    const row = Math.floor(this.pc / CRT.SCREEN_WIDTH);
    const col = this.pc % CRT.SCREEN_WIDTH;

    this.screen[row][col] = [col, col + 1, col - 1].includes(this.cpu.x);

    this.pc++;
  }

  public print() {
    console.log(
      this.screen.reduce((screenStr, row) => (
        screenStr + row.reduce((rowStr, isPixelOn) => rowStr + (isPixelOn ? '@@@' : '   '), '') + '\n'
      ), ''),
    );
  }
}

const part2Cpu = new CPU(program);
const crt = new CRT(part2Cpu);

for (let cycle = 1; cycle <= 240; cycle++) {
  crt.clockCycle();
  part2Cpu.clockCycle()
}

crt.print();
