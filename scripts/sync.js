const fs = require("fs");
const path = require("path");

const pinata = require("@pinata/sdk");
const Cloudflare = require("cloudflare");

const BuildDirectory = "./build/";

const Deployment = "yearn-meta";
const Domain = "meta.yearn.network";
const DNSLinkDomain = `_dnslink.${Domain}`;

async function publish(dataDir, deployment) {
  const ipfs = pinata(process.env.PINATA_KEY, process.env.PINATA_SECRET);
  const deployOptions = {
    pinataMetadata: { name: deployment },
    pinataOptions: { cidVersion: 0, wrapWithDirectory: false },
  };
  const cwd = process.cwd();
  const dir = path.join(cwd, dataDir);
  const hash = await ipfs.pinFromFS(dir, deployOptions);
  const filters = {
    status: "pinned",
    pageLimit: 1000,
    pageOffset: 0,
    metadata: { name: deployment },
  };
  const pinned = await ipfs.pinList(filters);
  pinned.rows.forEach((element) => {
    if (element.ipfs_pin_hash != hash) {
      ipfs.unpin(element.ipfs_pin_hash);
    }
  });
  return hash;
}

async function update(dnslinkDomain, cid) {
  const zone = process.env.CLOUDFLARE_ZONE;
  const token = process.env.CLOUDFLARE_SECRET;
  const cf = new Cloudflare({ token });
  const records = await cf.dnsRecords.browse(zone);
  const result = records.result;
  const dnslink = result.find((record) => record.name === dnslinkDomain);
  const content = `dnslink=/ipfs/${cid}`;
  await cf.dnsRecords.edit(zone, dnslink.id, {
    type: "TXT",
    name: dnslinkDomain,
    content,
    ttl: 1,
  });
}

async function sync(dataDir, deployment, dnslinkDomain) {
  const hash = await publish(dataDir, deployment);
  await update(dnslinkDomain, hash.IpfsHash);
  return hash.IpfsHash;
}

const cwd = process.cwd();
if (!fs.existsSync(path.join(cwd, ".git"))) {
  console.error("Error: script should be run in the root of the repo.");
  process.exit(1);
}

try {
  sync(BuildDirectory, Deployment, DNSLinkDomain).then((hash) => {
    console.log(`Ok: deployed to IPFS (${hash})!`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
