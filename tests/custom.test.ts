import fs from "fs";
import path from "path";
// @ts-ignore
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { Contract as Custom } from "./assets/custom/definition";

import { init } from "../src/client";
import { ContractManager } from "../src/index";

jest.setTimeout(120 * 1000);

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

test("Custom - Install actor", async () => {
  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await ContractManager.install(account, path.join(__dirname, "./assets/custom/binary.wasm"));
  const { cid, isInstalled } = resp;

  expect(cid).toBeDefined();
  expect(isInstalled).toBeDefined();

  cidToUse = cid;
});

test("Custom - Method say_hello ", async () => {
  if (!cidToUse) throw new Error("CID should be present in order to create a new instance");

  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/custom/abi.json"), "utf-8"));
  const client = ContractManager.create<Custom>(cidToUse, ABI);

  try {
    await client.new(account, "0");
    const message = await client.say_hello(account, "0", {
      u64Array: [1000n, 1000n],
      stringArray: ["data", "test", "dasda"],
      u64Map: { test: 1000n },
      customArg: {
        argumentsArray: [{ counterLong: 100n, counterShort: 111, message: "testing message 1" }],
        argumentsMap: { field1: { counterLong: 100n, counterShort: 111, message: "testing message 2" } },
      },
    });
    expect(message).toMatch(
      /^(Hello world 1 \/ Array\[0\]: 1000 \/ Array\[0\]: data \/ Map\['test'\]: 1000 \/ Field1OfArgOnMap: testing message 2 \/ Field1OfArgOnArray: testing message 1)$/
    );
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});
