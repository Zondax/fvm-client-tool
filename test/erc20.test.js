const fs = require("fs");
const path = require("path");
const { keyDerive } = require("@zondax/filecoin-signing-tools/js");

jest.setTimeout(30000);

const { init } = require("../src/client");
const { Contract } = require("../src/index");

let seed, nodeUrl, nodeToken, contractAddress;

beforeAll(() => {
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

test.skip("ERC20 - Many methods", async () => {
  const erc20_abi = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./assets/erc20/abi.json"), "utf-8")
  );

  const erc20ContractInst = Contract.load(erc20_abi);

  console.log("-----");
  console.log("ERC20");
  console.log("-----");
  await erc20ContractInst.GetName("value1");
  console.log("-----");
  await erc20ContractInst.GetSymbol();
  console.log("-----");
  await erc20ContractInst.GetDecimal();
  console.log("-----");
  await erc20ContractInst.GetTotalSupply();
  console.log("-----");
  await erc20ContractInst.GetBalanceOf("value1");
  console.log("-----");
  await erc20ContractInst.Transfer("value1", "value2");
  console.log("-----");
  await erc20ContractInst.Allowance("value1", "value2");
  console.log("-----");
  await erc20ContractInst.TransferFrom("value1", "value2", "value3");
  console.log("-----");
  await erc20ContractInst.Approval("value1", "value2");
  console.log("-----");
});
