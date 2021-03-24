const fs = require("fs-extra");
const path = require("path");

const IndexName = "index";
const DataDirectory = "data";
const SchemaDirectory = "schema";
const OutDirectory = "build";

const TrimmedExtensions = [".json"];

function build(directory) {
  const map = { files: [], directories: [] };
  for (let name of fs.readdirSync(directory)) {
    if (name.startsWith(".") || name === IndexName) continue;
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (stat.isFile()) {
      const parse = path.parse(file);
      if (TrimmedExtensions.includes(parse.ext)) {
        name = parse.name;
        fs.renameSync(file, path.join(directory, name));
      }
      map.files.push(name);
    } else if (stat.isDirectory()) {
      build(file);
      map.directories.push(name);
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
  if (fs.existsSync(OutDirectory)) {
    fs.removeSync(OutDirectory);
  }
  fs.mkdirSync(OutDirectory);
  fs.mkdirSync(path.join(OutDirectory, SchemaDirectory));
  fs.copySync(DataDirectory, OutDirectory);
  fs.copySync(SchemaDirectory, path.join(OutDirectory, SchemaDirectory));
  build(OutDirectory);
  console.log("Ok: build artifact generated!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
