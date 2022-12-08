import { readFileSync } from 'fs';

const terminalOutput = readFileSync('src/2022/7/input.txt', 'utf-8')
    .split('\n');

const location: string[] = [];

const getPath = (loc: string[]) => '/'.concat(loc.join('/'));

const getSubDirPaths = (loc: string[]) => [
    '/',
    ...loc.map((_, idx) => getPath(loc.slice(0, idx + 1)))
];

const dirs: Record<string, number> = {
    '/': 0,
};

terminalOutput.forEach((line: string) => {
    const parts = line.split(' ');

    if (parts[0] === '$') {
        if (parts[1] === 'ls') {
            return; // ignore ls command
        }

        switch (parts[2]) {
            case '..':
                location.pop();
                return;
            case '/':
                location.length = 0;
                return;
            default:
                location.push(parts[2]);
                return;
        }
    }

    if (parts[0] === 'dir') {
        const path = getPath([...location, parts[1]]);

        if (dirs[path] === undefined) {
            dirs[path] = 0; // init dir
        }

        return;
    }

    getSubDirPaths(location).forEach((path) => {
        dirs[path] += Number.parseInt(parts[0]);
    })
});

const MAX_DIR_SIZE = 100_000;

const answerPart1 = Object.values(dirs)
    .reduce((totalSize, dirSize) => (
        dirSize > MAX_DIR_SIZE ? totalSize : totalSize + dirSize
    ), 0);

const TOTAL_DISK_SPACE = 70_000_000;
const NEEDED_DISK_SPACE = 30_000_000;

const usedDiskSpace = dirs['/'];

const minDirSizeToBeDeleted = NEEDED_DISK_SPACE - (TOTAL_DISK_SPACE - usedDiskSpace);

let answerPart2 = usedDiskSpace;

Object.values(dirs).forEach((dirSize) => {
    if (dirSize >= minDirSizeToBeDeleted && dirSize < answerPart2) {
        answerPart2 = dirSize;
    }
});

console.log({
    answerPart1,
    answerPart2,
});
