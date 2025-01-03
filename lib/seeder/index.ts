import { db } from '../../src/db';
import fs from 'fs';
import path from 'path';

const dir = './seeders/';

function readAllFiles() {
  return fs.readdirSync(dir)
           .filter(name => path.extname(name) === '.json')
           .map(name => path.join(dir, name))}

export const up = async () => {
  const files = readAllFiles();

  for (let idxFile in files) {
    console.log(`running seeder up ${files[idxFile]}...`)
    const data = JSON.parse(fs.readFileSync(files[idxFile], 'utf-8'))
    const key = Object.keys(data)[0];
    if (key == null) {
      throw new Error("key not found");
    }
  
    for (let idxData in data[key]) {
      await db[key].insert(data[key][idxData])
    }
  }
  
  console.log("seeder has finished");
  process.exit(1)
}

export const remove = async () => {
  console.log(`removing all collections...`)
  await db.remove();
  console.log("all collections has been removed");
  process.exit(1)
}

const command = process.argv[2]; // Get the command from the arguments

if (command === 'seed') {
  up();
} else if (command === 'remove') {
  remove();
} else {
  console.error("Invalid command. Use 'seed' or 'remove'.");
  process.exit(1);
}
