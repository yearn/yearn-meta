const fs = require("fs");
const path = require("path");

const Ajv = require("ajv").default;

const SchemasDirectory = "./schema/";
const DataDirectory = "./data/";

const cwd = process.cwd();

if (!fs.existsSync(path.join(cwd, ".git"))) {
  console.error("Error: script should be run in the root of the repo.");
  process.exit(1);
}

function loadValidators() {
  const ajv = new Ajv();
  const validators = {};
  for (let name of fs.readdirSync(SchemasDirectory)) {
    const file = path.join(SchemasDirectory, name);
    const stat = fs.lstatSync(file);
    if (!stat.isFile()) continue;
    try {
      const schema = JSON.parse(fs.readFileSync(file, "utf-8"));
      validators[name] = ajv.compile(schema);
    } catch (error) {
      console.error(`Error: "${file}" is not a valid schema.`);
      process.exit(1);
    }
  }
  return validators;
}

function validate(directory, validators) {
  let allValid = true;
  for (let name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (stat.isFile() && validators[name]) {
      const validator = validators[name];
      let data;
      try {
        data = JSON.parse(fs.readFileSync(file, "utf-8"));
      } catch {
        console.error(`Error: "${file}" is not a valid JSON file.`);
        continue;
      }
      const valid = validator(data);
      if (!valid) {
        console.error(`Error: "${file}" does not follow "${name}" schema:`);
        for (const error of validator.errors) {
          console.log(` - ${error.message}`);
        }
        allValid = false;
      }
    } else if (stat.isDirectory()) {
      allValid &= validate(file, validators);
    }
  }
  return allValid;
}

try {
  const validators = loadValidators();
  const valid = validate(DataDirectory, validators);
  if (!valid) process.exit(1);
} catch (error) {
  console.error(error);
  process.exit(1);
}
