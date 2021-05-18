const fetch = require("node-fetch");
const fs = require("fs");
const { exec } = require("child_process");

const vaults = [];
const migratedVaultsUrl =
  "https://raw.githubusercontent.com/yearn/yearn-finance/develop/app/containers/Vaults/migrationWhitelist.json";
const retiredVaultsUrl =
  "https://raw.githubusercontent.com/yearn/yearn-finance/develop/app/containers/Vaults/retiredWhitelist.json";

const getMigratedVaults = async () => {
  const req = await fetch(migratedVaultsUrl);
  const vaultsJson = await req.json();
  return vaultsJson;
};

const getRetiredVaults = async () => {
  const req = await fetch(retiredVaultsUrl);
  const vaultsJson = await req.json();
  return vaultsJson;
};

const hasVault = (vaults, vault) => {
  let message = null;
  let isIn = false;
  vaults.forEach((v) => {
    if (vault.address === v.address) {
      message = v.migrationMessage ? v.migrationMessage : v.apyTooltip;
      isIn = true;
    }
  });
  return { isIn, message };
};

const getVaults = async () => {
  const req = await fetch("https://vaults.finance/all");
  const vaultsJson = await req.json();
  console.log(vaultsJson);
  const migratedVaults = await getMigratedVaults();
  const retiredVaults = await getRetiredVaults();
  vaultsJson.forEach((vault) => {
    const hasRetired = hasVault(retiredVaults, vault);
    const hasMigrated = hasVault(migratedVaults, vault);
    const schemaVault = {
      $schema: "vault",
      name: vault.displayName,
      description: vault.name,
      promoted: vault.endorsed,
      retired: hasRetired.isIn,
      migrated: hasMigrated.isIn,
      depositDisabled: hasRetired.isIn,
      depositDisabledMessage: hasMigrated.message || hasRetired.message || "",
      withdrawDisabled: false,
      withdrawDisabledMessage: false,
      apy: {
        calculation: vault.apy ? vault.apy.type : "",
      },
    };
    vaults.push(schemaVault);
  });
  vaults.forEach((vault, i) => {
    fs.writeFile(
      `data/vaults/${vaultsJson[i].address}.json`,
      JSON.stringify(vault),
      function (err) {
        if (err) return console.log(err);
        console.log(`generating json for vault ${vault.name}`);
      }
    );
  });

  exec('prettier --write "data/vaults/**/*.json"', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  return vaultsJson;
};
getVaults();
