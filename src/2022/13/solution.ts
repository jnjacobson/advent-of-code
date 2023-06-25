import { readFileSync } from "fs";

function inOrder(leftPacket: unknown[], rightPacket: unknown[]): boolean | null {
  for (let i = 0; i < Math.max(leftPacket.length, rightPacket.length); i++) {
    let leftValue = leftPacket?.[i];
    let rightValue = rightPacket?.[i];

    if (leftValue === undefined && rightValue !== undefined) {
      return true;
    }

    if (leftValue !== undefined && rightValue === undefined) {
      return false;
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      if (leftValue < rightValue) return true;
      if (leftValue > rightValue) return false;

      continue;
    }

    if (typeof leftValue === 'number') {
      leftValue = [leftValue];
    } else if (typeof rightValue === 'number') {
      rightValue = [rightValue];
    }

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
      const valuesInOrder = inOrder(leftValue, rightValue);

      if (valuesInOrder === null) continue;

      return valuesInOrder;
    }
  }

  return null;
}

const pairs = readFileSync('src/2022/13/input.txt', 'utf-8')
  .split('\n\n')
  .map((raw: string) => {
    const [leftPacket, rightPacket] = raw.split('\n');

    return [
      JSON.parse(leftPacket),
      JSON.parse(rightPacket),
    ];
  });

const inOrderPairIdxSum = pairs.reduce((acc, [leftPacket, rightPacket], idx) => (
  acc + (inOrder(leftPacket, rightPacket) ? idx + 1 : 0)
), 0);

console.log({
  answerPart1: inOrderPairIdxSum
})

const DIVIDER_PACKETS = [[[2]], [[6]]];
const packets = pairs.flat(1);

const sortedPackets = [...packets, ...DIVIDER_PACKETS].sort((leftPacket, rightPacket) => (
  inOrder(leftPacket, rightPacket) ? -1 : 1
));

function findPacketIdx(packetToFind: unknown[]) {
  return sortedPackets.findIndex((packet) => JSON.stringify(packet) === JSON.stringify(packetToFind)) + 1;
}

const decoderKey = findPacketIdx(DIVIDER_PACKETS[0]) * findPacketIdx(DIVIDER_PACKETS[1]);

console.log({
  answerPart2: decoderKey,
});
 