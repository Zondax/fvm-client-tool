const fs = require("fs");
const path = require("path");
const { keyDerive } = require("@zondax/filecoin-signing-tools/js");

jest.setTimeout(30000);

const { init } = require("../src/client");
const { Contract } = require("../src/index");

let seed, nodeUrl, nodeToken, contractAddress;

beforeAll(async () => {
  seed = process.env.SEED;
  nodeUrl = process.env.NODE_URL;
  nodeToken = process.env.NODE_TOKEN;
  contractAddress = process.env.CONTRACT_ADDRESS;

  console.log("Env Config");
  console.log("---------");
  console.log("NodeURL: " + nodeUrl);
  console.log("NodeToken: " + nodeToken);
  console.log("Seed: " + seed);
  console.log("Contract Address: " + contractAddress);
  console.log("---------");
  console.log("---------");
});

test("Hello World - Install actor", async () => {
  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const resp = await Contract.install(account, path.join(__dirname, "./assets/hello_world/binary.wasm"));
  const [cid, isInstalled] = resp;

  expect(cid).toBeDefined();
  expect(isInstalled).toBeDefined();
});

test("Hello World - Method say_hello ", async () => {
  const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

  init(nodeUrl, nodeToken);
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./assets/hello_world/abi.json"), "utf-8"));
  const client = Contract.load(contractAddress, ABI);

  try {
    const message = await client.say_hello(account, "0");
    expect(new RegExp(/Hello world \d+/).test(message)).toBeTruthy();
  } catch (e) {
    if (e.response) console.log("Error: " + JSON.stringify(e.response.data));
    else console.log("Error: " + e);

    expect(e).not.toBeDefined();
  }
});
