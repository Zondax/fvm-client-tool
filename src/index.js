const fs = require("fs");
const cbor = require("@ipld/dag-cbor");
const { sendTrx } = require("./client");
const { attachMethods } = require("./utils");
const { INIT_ACTOR_INSTALL_METHOD, INIT_ACTOR_ADDRESS, INIT_ACTOR_CREATE_METHOD } = require("./constants");

class Contract {
  methods = {};
  address = null;
  cid = null;

  static async install(account, binaryPath) {
    if (!fs.existsSync(binaryPath)) throw new Error(`file ${binaryPath} does not exist`);
    const code = fs.readFileSync(binaryPath);
    const params = cbor.encode([new Uint8Array(code.buffer)]);

    const { Return: resp } = await sendTrx(account, INIT_ACTOR_ADDRESS, INIT_ACTOR_INSTALL_METHOD, "0", params);

    const respBuffer = Buffer.from(resp, "base64");
    const [cid, isInstalled] = cbor.decode(Uint8Array.from(respBuffer));

    return { cid, isInstalled };
  }

  static async instantiate(account, cid, value, ...txParams) {
    const params = cbor.encode([cid, Buffer.from(cbor.encode(txParams))]);

    const { ReturnDec: resp } = await sendTrx(account, INIT_ACTOR_ADDRESS, INIT_ACTOR_CREATE_METHOD, value, params);
    const { IDAddress, RobustAddress } = resp;

    return { IDAddress, RobustAddress };
  }

  static load(address, { functions, types }) {
    const instance = new Contract();
    instance.address = address;

    attachMethods(instance, functions, types);

    return instance;
  }

  static create(cid, { functions, types }) {
    const instance = new Contract();
    instance.cid = cid;

    attachMethods(instance, functions, types);

    return instance;
  }

  setContractAddress = (address) => {
    if (this.address) throw new Error("the contract address cannot be changed");
    this.address = address;
  };
}

exports.Contract = Contract;
