import fs from "fs";
import path from "path";
// @ts-ignore
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { Contract as ERC20 } from "./assets/erc20/definition";

import { init } from "../src/client";
import { ContractManager } from "../src/index";

jest.setTimeout(60 * 1000);

const ADDRESS_ID_1 = "1025";
const ADDRESS_ID_2 = "1001";

let seed, nodeUrl, nodeToken;
let cidToUse, contractAddress;

beforeAll(async () => {
  seed = process.env.SEED;
  nodeUrl = process.env.NODE_URL;
  nodeToken = process.env.NODE_TOKEN;

  console.log(`
  Env Config
  ---------
  NodeURL: ${nodeUrl}
  NodeToken: ${nodeToken}
  Seed: ${seed}
  ---------
  ---------`);
});

test("ERC20 - Install actor", async () => {
  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await ContractManager.install(account, path.join(__dirname, "./assets/erc20/binary.wasm"));
  const { cid, isInstalled } = resp;

  expect(cid).toBeDefined();
  expect(isInstalled).toBeDefined();

  cidToUse = cid;
});

test("ERC20 - Method GetSymbol", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8"));
  const client = ContractManager.create<ERC20>(cidToUse, ABI);

  try {
    await client.new(account, "0", { name: "ZondaxCoin", symbol: "ZDX", decimal: 18, totalSupply: 1000000n, ownerAddr: ADDRESS_ID_1 });
    const message = await client.GetSymbol(account, "0");
    expect(message).toMatch(/Token symbol: ZDX/);
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});

test("ERC20 - Method Approval", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8"));
  const client = ContractManager.create<ERC20>(cidToUse, ABI);

  try {
    await client.new(account, "0", { name: "ZondaxCoin", symbol: "ZDX", decimal: 18, totalSupply: 1000000n, ownerAddr: ADDRESS_ID_1 });
    const message = await client.Approval(account, "0", { spenderAddr: ADDRESS_ID_2, newAllowance: 1000n });
    expect(message).toMatch(`Approval ${ADDRESS_ID_1}${ADDRESS_ID_2} for 1000 ZDX`);
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});

test("ERC20 - Method GetSymbol ", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8"));
  const client = ContractManager.create<ERC20>(cidToUse, ABI);

  try {
    await client.new(account, "0", { name: "ZondaxCoin", symbol: "ZDX", decimal: 18, totalSupply: 1000000n, ownerAddr: ADDRESS_ID_1 });
    const message = await client.GetSymbol(account, "0");
    expect(message).toMatch(/Token symbol: ZDX/);
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});
