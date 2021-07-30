const fs = require("fs-extra");
const path = require("path");

const IndexName = "index";
const DataDirectory = "data";
const SchemaDirectory = "schema";
const OutDirectory = "build";

const CustomBuildScript = "_build.js";

const TrimmedExtensions = [".json"];
const ExcludedExtensions = [".js"];

function build(directory) {
  const map = { files: [], directories: [] };
  const customBuildScript = path.join(directory, CustomBuildScript);
  if (fs.existsSync(customBuildScript)) {
    try {
      const stdout = require("child_process").execSync(`node ${customBuildScript}`);
      process.stdout.write(stdout.toString());
    } catch (error) {
      const message = error.stderr.toString();
      console.error(
        message ||
          `Err: custom build script "${customBuildScript}" returned a non zero exit code`
      );
      process.exit(error.status || 1);
    }
  }
  for (let name of fs.readdirSync(directory)) {
    if (name.startsWith(".") || name === IndexName) continue;
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (stat.isFile()) {
      const parse = path.parse(file);
      if (ExcludedExtensions.includes(parse.ext)) {
        fs.removeSync(file);
        continue;
      }
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
