import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let all = [];
let supportedZaps = [];

for (const name of fs.readdirSync(__dirname)) {
  const file = path.join(__dirname, name);
  const stat = fs.lstatSync(file);
  if (stat.isFile()) {
    const parse = path.parse(file);
    if (parse.ext === ".json") {
      const source = JSON.parse(fs.readFileSync(file));
      source.address = parse.name;
      all.push(source);

      if (source.supportedZaps) {
        let obj = {};
        obj[source.address] = source.supportedZaps;
        supportedZaps.push(obj);
      }
    }
  }
}

fs.writeFileSync(path.join(__dirname, "all"), JSON.stringify(all));
fs.writeFileSync(
  path.join(__dirname, "allSupportedZaps"),
  JSON.stringify(supportedZaps)
);
