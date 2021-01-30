# Yearn metadata storage

[![Validation](https://github.com/iearn-finance/yearn-meta/workflows/Validation/badge.svg)](https://github.com/iearn-finance/yearn-meta/actions?query=workflow%3AValidation)
[![Deployment](https://github.com/iearn-finance/yearn-meta/workflows/Deployment/badge.svg)](https://github.com/iearn-finance/yearn-meta/actions?query=workflow%3ADeployment)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

## What?

This repo contains all the metadata of the yearn ecosystem. Contents of the
[`data`](./data) directory are synced to IPFS for storage, accessible through
our gateway [meta.yearn.network](https://meta.yearn.network). Consistency of
the stored data is verified by smalls scripts and schemas.

## Adding documents

Any document can be added to the [`data`](./data) directory, but there are some
special checks to ensure consistency and ease of accessibility:

- All JSON files that share names with the files in the [`schema`](./schema)
  directory must follow the defined schema, otherwise verification will fail.
- Any folder that begins with `0x` is considered as an address. The address must
  be checksummed, otherwise verification will fail.
- All files named `index.json` will be overwritten ignored by git and will be
  overwritten by the indexing process. (see [indexing](#indexes))

Yearn has also a [naming standard](./docs/naming-standard.md) that is not
enforced programmatically but should be followed.

## Adding schemas

Schemas can be created in the root of the [`schema`](./schema) folder. For
syntax you can take a look at the [JSON schema specs](https://json-schema.org).
The [AJV](https://github.com/ajv-validator/ajv) library is used to validate the
data with the provided schemas.

## Syncing with IPFS

After each commit to master, direct or as a result of a merged pull request, a
sync to IPFS is triggered. After the upload is complete the
[meta.yearn.network](https://meta.yearn.network) is updated automatically to
point to the latest IPFS cid.

We rely on [pinata.cloud](https://pinata.cloud) for the IPFS hosting, and on
[cloudflare](https://cloudflare-ipfs.com) for the the gateway proxy.

## Indexes

Before each deployment the [`data`](./data) directory is scanned and an
`index.json` file is generated inside each directory (root included). The file
follows the [`index.json` schema](./schema/index.json) and will contain
information about the files and folders stored in that directory. For an example
see [meta.yearn.network/index.json](https://meta.yearn.network/json)

## Helpful links

- 🌐 [Live site](https://yearn.network)
- ⚖️ [Governance forum](https://gov.yearn.finance)
- 📑 [Documentation](https://docs.yearn.finance)

## Contributing

Code style follows prettier conventions (`yarn format`). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
