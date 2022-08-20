import fs from "fs";
import path from "path";
// @ts-ignore
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { ContractManager, init } from "../src/index";

import { Contract as HelloWorld } from "./contract/hello_world/definition";
import { Contract as ERC20 } from "./contract/erc20/definition";
import { Contract as Custom } from "./contract/custom/definition";

const seed = process.env.SEED;
const nodeUrl = process.env.NODE_URL || "";
const nodeToken = process.env.NODE_TOKEN || "";

const ADDRESS_ID_1 = "1025";
const ADDRESS_ID_2 = "1001";

const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

async function runHelloWorld() {
  // Install actor
  console.log("Installing HelloWorld");
  const resp = await ContractManager.install(account, path.join(__dirname, "./contract/hello_world/binary.wasm"));
  const { cid, isInstalled } = resp;

  // Create client instance for Hello World
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/hello_world/abi.json"), "utf-8"));
  const client = ContractManager.create<HelloWorld>(cid, ABI);

  // Create new instance of the contract
  console.log("Instantiating HelloWorld");
  await client.new(account, "0");

  // Call say_hello method
  console.log("Calling say_hello");
  const message1 = await client.say_hello(account, "0");
  console.log("Result: " + message1);

  // Call say_hello method
  console.log("Calling say_hello");
  const message2 = await client.say_hello(account, "0");
  console.log("Result: " + message2);
  console.log("-------");
}

async function runCustom() {
  // Install actor
  console.log("Installing Custom");
  const resp = await ContractManager.install(account, path.join(__dirname, "./contract/custom/binary.wasm"));
  const { cid, isInstalled } = resp;

  // Create client instance for Hello World
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/custom/abi.json"), "utf-8"));
  const client = ContractManager.create<Custom>(cid, ABI);

  // Create new instance of the contract
  console.log("Instantiating Custom");
  await client.new(account, "0");

  // Create client from pre-existing instance of the contract
  const contractAddress = (client as any as ContractManager).getContractAddress();
  const clientFromAddress = ContractManager.load<Custom>(contractAddress, ABI);

  const args = {
    u64Array: [1000n, 1000n],
    stringArray: ["data", "test", "dasda"],
    u64Map: { test: 1000n },
    customArg: {
      argumentsArray: [{ counterLong: 100n, counterShort: 11111, message: "testing message 1" }],
      argumentsMap: { field1: { counterLong: 100n, counterShort: 111, message: "testing message 2" } },
    },
  };

  // Call say_hello method
  console.log("Calling say_hello from new instance");
  const message_1 = await client.say_hello(account, "0", args);

  console.log("Result: " + message_1);

  // Call say_hello method
  console.log("Calling say_hello from pre-existing instance");
  const message_2 = await clientFromAddress.say_hello(account, "0", args);

  console.log("Result: " + message_2);
  console.log("-------");
}

async function runERC20() {
  // Install actor
  console.log("Installing ERC20");
  const resp = await ContractManager.install(account, path.join(__dirname, "./contract/erc20/binary.wasm"));
  const { cid, isInstalled } = resp;

  // Create client instance for Hello World
  const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/erc20/abi.json"), "utf-8"));
  const client = ContractManager.create<ERC20>(cid, ABI);

  // Create new instance of the contract
  console.log("Instantiating ERC20");
  await client.new(account, "0", { name: "ZondaxCoin", symbol: "ZDX", decimal: 18, totalSupply: 1000000n, ownerAddr: ADDRESS_ID_1 });

  // Call GetSymbol method
  console.log("Calling GetSymbol");
  const message1 = await client.GetSymbol(account, "0");
  console.log("Result: " + message1);

  // Call Approval method
  console.log("Calling Approval");
  const message2 = await client.Approval(account, "0", { spenderAddr: ADDRESS_ID_2, newAllowance: 1000n });
  console.log("Result: " + message2);
  console.log("-------");
}

async function runSequentially() {
  await runHelloWorld();
  await runCustom();
  await runERC20();
}

// Init lib config
init(nodeUrl, nodeToken);

// Run examples
runSequentially();
