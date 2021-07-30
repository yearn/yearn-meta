const fs = require("fs");
const path = require("path");

for (const name of fs.readdirSync(__dirname)) {
  const file = path.join(__dirname, name);
  const stat = fs.lstatSync(file);
  if (stat.isFile()) {
    const parse = path.parse(file);
    if (parse.ext === ".json") {
      const source = JSON.parse(fs.readFileSync(file));
      const addresses = source.addresses;
      for (const address of addresses) {
        const copy = { ...source };
        delete copy.addresses;
        // TODO: replace token with crToken
        // copy.description = copy.description.replace("{{token}}", address);
        fs.writeFileSync(path.join(__dirname, address), JSON.stringify(copy));
      }
    }
  }
}
