import fs from "fs";
import path from "path";
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { Contract as HelloWorld } from "./assets/hello_world/definition";

jest.setTimeout(60 * 1000);

import { init } from "../src/client";
import { Contract } from "../src/index";

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

test("Hello World - Install actor", async () => {
  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await Contract.install(account, path.join(__dirname, "./assets/hello_world/binary.wasm"));
  const { cid, isInstalled } = resp;

  expect(cid).toBeDefined();
  expect(isInstalled).toBeDefined();

  cidToUse = cid;
});

test("Hello World - Create actor", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await Contract.instantiate(account, cidToUse, "0");
  const { IDAddress, RobustAddress } = resp;

  expect(IDAddress).toBeDefined();
  expect(RobustAddress).toBeDefined();

  contractAddress = IDAddress;
});

test("Hello World - Method say_hello ", async () => {
  if (!contractAddress) throw new Error("Contract address should be present in order to run a method");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/hello_world/abi.json"), "utf-8"));
  const client = Contract.load<HelloWorld>(contractAddress, ABI);

  try {
    const message = await client.say_hello(account, "0");
    expect(new RegExp(/Hello world \d+/).test(message)).toBeTruthy();
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});

test("Hello World - Create and Method say_hello ", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/hello_world/abi.json"), "utf-8"));
  const client = Contract.create<HelloWorld>(cidToUse, ABI);

  try {
    await client.new(account, "0");
    const message = await client.say_hello(account, "0");
    expect(new RegExp(/Hello world \d+/).test(message)).toBeTruthy();
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});
