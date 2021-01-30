const fs = require("fs");
const path = require("path");

const IndexName = "index.json";
const DataDirectory = "./data/";

function index(directory) {
  const map = { files: [], dirs: [] };
  for (let name of fs.readdirSync(directory)) {
    if (name.startsWith(".") || name === IndexName) continue;
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (stat.isFile()) {
      map.files.push(name);
    } else if (stat.isDirectory()) {
      index(file);
      map.dirs.push(name);
    }
  }
  fs.writeFileSync(path.join(directory, IndexName), JSON.stringify(map));
}

const cwd = process.cwd();
if (!fs.existsSync(path.join(cwd, ".git"))) {
  console.error("Error: script should be run in the root of the repo.");
  process.exit(1);
}

try {
  index(DataDirectory);
  console.log("Ok: index files generated!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
