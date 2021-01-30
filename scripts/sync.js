const fs = require("fs");
const path = require("path");

const pinata = require("@pinata/sdk");
const Cloudflare = require("cloudflare");

const DeployName = "yearn-meta";
const DataDirectory = "./data/";
const Domain = "meta.yearn.network";
const DNSLinkDomain = `_dnslink.${Domain}`;

const cwd = process.cwd();

if (!fs.existsSync(path.join(cwd, ".git"))) {
  console.error("Error: script should be run in the root of the repo.");
  process.exit(1);
}

async function publish() {
  const ipfs = pinata(process.env.PINATA_KEY, process.env.PINATA_SECRET);
  const deployOptions = {
    pinataMetadata: { name: DeployName },
    pinataOptions: { cidVersion: 0, wrapWithDirectory: false },
  };
  const dir = path.join(cwd, DataDirectory);
  const hash = await ipfs.pinFromFS(dir, deployOptions);
  const filters = {
    status: "pinned",
    pageLimit: 1000,
    pageOffset: 0,
    metadata: { name: DeployName },
  };
  const pinned = await ipfs.pinList(filters);
  pinned.rows.forEach((element) => {
    if (element.ipfs_pin_hash != hash) {
      ipfs.unpin(element.ipfs_pin_hash);
    }
  });
  return hash;
}

async function update(cid) {
  const zone = process.env.CLOUDFLARE_ZONE;
  const token = process.env.CLOUDFLARE_SECRET;
  const cf = new Cloudflare({ token });
  const records = await cf.dnsRecords.browse(zone);
  const result = records.result;
  const dnslink = result.find((record) => record.name === DNSLinkDomain);
  const content = `dnslink=/ipfs/${cid}`;
  await cf.dnsRecords.edit(zone, dnslink.id, {
    type: "TXT",
    name: DNSLinkDomain,
    content,
    ttl: 1,
  });
}

async function deploy() {
  const hash = await publish();
  await update(hash.IpfsHash);
}

try {
  deploy();
} catch (error) {
  console.error(error);
  process.exit(1);
}
