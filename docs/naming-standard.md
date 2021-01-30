# Yearn Naming Standard

## yVaults

- Acceptable alternative names include Yearn Vaults, or informally referring to the product as vaults.
- When referring to a specific yVault, the preferred name is generally `token name + yVault`; this matches the `name` field on the token contract. However, it is also acceptable to use `yvToken + Vault` or `yvToken`; the latter matches `symbol` in the contract.
  - **Examples:** `DAI yVault`, `yvDAI Vault`, or simply `yvDAI`
- For each yVault, name and symbol conventions are as follows:
  - Name: `${token.symbol()} or override yVault`
  - Symbol: `yv${token.symbol()} or override`
- A `version` field is included in the token contract to correspond to the major yVault release version.
- The predominant use case for name and symbol override is for LP tokens.
  - Curve
    - Name: `Curve + pool + Pool yVault`
      - **Examples:** `Curve sBTC Pool yVault`, `Curve 3pool yVault`, `Curve Y Pool yVault`
      - In this case, `pool` is taken directly from Curve.fi's UI, and we can adjust for capitalization as needed. In the case of the `3pool`, the redundant "Pool" is removed.
    - Symbol: `yvCurve-pool`
      - **Examples:** `yvCurve-sBTC`, `yvCurve-3pool`, `yvCurve-Y`
    - Note: In this methodology, `yvCurve-Y` replaces the previously used `yUSD`. In the future, `yUSD` will be used to refer to the Meta Vault token.
  - Uniswap
    - Name: `Uniswap + v${self.version()} + TOKEN-TOKEN + Pool yVault`
      - **Examples:** `Uniswap v2 USDT-WETH Pool yVault`, `Uniswap v2 WBTC-WETH Pool yVault`
    - Symbol: `yvUni-TOKEN-TOKEN`
      - **Examples:** `yvUni-USDT-WETH`, `yvUni-WBTC-WETH`
    - Note: Version was included for Uniswap LP tokens to help limit confusion between UNI-v2 LP tokens and upcoming UNI-v3 LP tokens.
  - Balancer
    - Name: `Balancer + TOKEN-TOKEN + Pool yVault`
      - **Examples:** `Balancer USDT-WETH Pool yVault`, `Balancer WBTC-WETH Pool yVault`
    - Symbol: `yvBal-TOKEN-TOKEN`
      - **Examples:** `yvBal-USDT-WETH`, `yvBal-WBTC-WETH`
    - Note: Since Balancer allows more than two tokens per pool, append as many `TOKEN` as needed for the pool in question.

## yCover

- Tokens for yCover are named following a similar methodology as yVaults, with the only difference being the two letter prefix.
  - **Examples:** `ycUSDC`, `ycUni-USDT-WETH`

## yEarn

- These are Yearn's original yield-aware tokens, whose v2 and v3 contracts can be found [here](https://docs.yearn.finance/developers/deployed-contracts-registry#v2-yield-tokens).
- These products should be referred to as yEarn Tokens, `underlying token name + Earn`, or `y{token.symbol()}v${self.version()}`
  - **Examples:** `yDAIv2`, `yDAI Earn`, `yBUSDv3`, `yBUSD Earn`

## Test Products

- For deployed contracts that have not reached their final production version, a simple modification is included to designate these on the contract level as being test products.
  - Name: `${token.symbol()} or override + Test + Product`
  - Symbol: `yt${token.symbol()} or override`
  - **Examples:** `DAI Test yVault`, `ytDAI`
- Additionally, the v2 yVault contracts have upgradeable `name` and `symbol` fields. This means that should a test contract perform well, these fields can be updated to reflect that it is no longer a test contract, removing the need to deploy new contracts.

## Future Products

- Future products can follow a simple naming convention: `y + product`, where the product and any potential token names follow similar guidelines as above with yVaults. These can then be further modified as needed based on the product(s).
  - **Examples:** `ySwap`, `yBorrow`, `yTrade`

## Current yVaults and v2 Names

| Current Name                          | Current Symbol          | v2 Name                | v2 Symbol     | Current Vault Token Contract               |
| ------------------------------------- | ----------------------- | ---------------------- | ------------- | ------------------------------------------ |
| yearn Wrapped Ether                   | yWETH                   | WETH yVault            | yvWETH        | 0xe1237aa7f535b0cc33fd973d66cbf830354d16c7 |
| yearn yearn.finance                   | yYFI                    | YFI yVault             | yvYFI         | 0xba2e7fed597fd0e3e70f5130bcdbbfe06bb94fe1 |
| yearn Curve.fi DAI/USDC/USDT          | y3Crv                   | Curve 3pool yVault     | yvCurve-3pool | 0x9cA85572E6A3EbF24dEDd195623F188735A5179f |
| yearn Curve.fi yDAI/yUSDC/yUSDT/yTUSD | yyDAI+yUSDC+yUSDT+yTUSD | Curve Y Pool yVault    | yvCurve-Y     | 0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c |
| yearn Curve.fi yDAI/yUSDC/yUSDT/yBUSD | yyDAI+yUSDC+yUSDT+yBUSD | Curve BUSD Pool yVault | yvCurve-BUSD  | 0x2994529C0652D127b7842094103715ec5299bBed |
| yearn Curve.fi renBTC/wBTC/sBTC       | ycrvRenWSBTC            | Curve sBTC Pool yVault | yvCurve-sBTC  | 0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6 |
| yearn Dai Stablecoin                  | yDAI                    | DAI yVault             | yvDAI         | 0xACd43E627e64355f1861cEC6d3a6688B31a6F952 |
| yearn TrueUSD                         | yTUSD                   | TUSD yVault            | yvTUSD        | 0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a |
| yearn USD//C                          | yUSDC                   | USDC yVault            | yvUSDC        | 0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e |
| yearn Tether USD                      | yUSDT                   | USDT yVault            | yvUSDT        | 0x2f08119C6f07c006695E079AAFc638b8789FAf18 |
| yearn Gemini Dollar                   | yGUSD                   | GUSD yVault            | yvGUSD        | 0xec0d8D3ED5477106c6D4ea27D90a60e594693C90 |
| yearn Aave Interest bearing LINK      | yaLINK                  | aLINK yVault           | yvaLINK       | 0x29E240CFD7946BA20895a7a02eDb25C210f9f324 |
