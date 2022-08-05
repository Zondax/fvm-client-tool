import fs from "fs";
import path from "path";
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { Contract as ERC20 } from "./assets/erc20/definition";

jest.setTimeout(60 * 1000);

import { init } from "../src/client";
import { Contract } from "../src/index";

const ADDRESS_ID_1 = "1006";

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
  const resp = await Contract.install(account, path.join(__dirname, "./assets/erc20/binary.wasm"));
  const { cid, isInstalled } = resp;

  expect(cid).toBeDefined();
  expect(isInstalled).toBeDefined();

  cidToUse = cid;
});

test("ERC20 - Create actor", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await Contract.instantiate(account, cidToUse, "0", "ZondaxCoin", "ZDX", 18, 1000000, ADDRESS_ID_1);
  const { IDAddress, RobustAddress } = resp;

  expect(IDAddress).toBeDefined();
  expect(RobustAddress).toBeDefined();

  contractAddress = IDAddress;
});

test("ERC20 - Method GetSymbol", async () => {
  if (!contractAddress) throw new Error("Contract address should be present in order to run a method");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8"));
  const client = Contract.load<ERC20>(contractAddress, ABI);

  try {
    const message = await client.GetSymbol(account, "0");
    expect(new RegExp(/Token symbol: ZDX/).test(message)).toBeTruthy();
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});

test("ERC20 - Create and Method GetSymbol ", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8"));
  const client = Contract.create<ERC20>(cidToUse, ABI);

  try {
    await client.new(account, "0", "ZondaxCoin", "ZDX", 18, 1000000, ADDRESS_ID_1);
    const message = await client.GetSymbol(account, "0");
    expect(new RegExp(/Token symbol: ZDX/).test(message)).toBeTruthy();
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});
