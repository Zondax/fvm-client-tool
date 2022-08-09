import fs from "fs";
import path from "path";
// @ts-ignore
import { keyDerive } from "@zondax/filecoin-signing-tools/js";
import { ContractManager } from "@zondax/fvm-client-tool/dist";
import { init } from "@zondax/fvm-client-tool/dist/client";

import { Contract as HelloWorld } from "./contract/hello_world/definition";
import { Contract as ERC20 } from "./contract/erc20/definition";

const seed = process.env.SEED;
const nodeUrl = process.env.NODE_URL || "";
const nodeToken = process.env.NODE_TOKEN || "";

const ADDRESS_ID_1 = "1025";
const ADDRESS_ID_2 = "1001";

const account = keyDerive(seed, "m/44'/461'/0/0/1", "");

async function runHelloWorld() {
    // Install actor
    const resp = await ContractManager.install(account, path.join(__dirname, "./contract/hello_world/binary.wasm"));
    const {cid, isInstalled} = resp;

    // Create client instance for Hello World
    const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/hello_world/abi.json"), "utf-8"));
    const client = ContractManager.create<HelloWorld>(cid, ABI);

    // Create new instance of the contract
    await client.new(account, "0");

    // Call say_hello method
    const message = await client.say_hello(account, "0", [1000n,1000n], ["data", "test", "dasda"], {"test": 1000n}, {field1:100n, field2:111, field3: "asdasd",field4:{field1:100n, field2:111, field3: "asdasd"} });

    console.log(message)
}

async function runERC20() {
    // Install actor
    const resp = await ContractManager.install(account, path.join(__dirname, "./contract/erc20/binary.wasm"));
    const {cid, isInstalled} = resp;

    // Create client instance for Hello World
    const ABI = JSON.parse(fs.readFileSync(path.join(__dirname, "./contract/erc20/abi.json"), "utf-8"));
    const client = ContractManager.create<ERC20>(cid, ABI);

    // Create new instance of the contract
    await client.new(account, "0", "ZondaxCoin", "ZDX", 18, 1000000n, ADDRESS_ID_1);

    // Call GetSymbol method
    const message1 = await client.GetSymbol(account, "0");
    console.log(message1)

    // Call Approval method
    const message2 = await client.Approval(account, "0", ADDRESS_ID_2, 1000n);
    console.log(message2)
}

async function runSequentially(){
    await runHelloWorld()
    await runERC20()
}

// Init lib config
init(nodeUrl, nodeToken);

runSequentially();
