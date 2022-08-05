const fs = require("fs");
const cbor = require("@ipld/dag-cbor");
const { sendTrx } = require("./client");
const { checkTypes } = require("./utils");
const { INIT_ACTOR_INSTALL_METHOD, INIT_ACTOR_ADDRESS } = require("./constants");

class Contract {
  methods = {};
  address = {};

  static async install(account, binaryPath) {
    if (!fs.existsSync(binaryPath)) throw new Error(`file ${binaryPath} does not exist`);
    const code = fs.readFileSync(binaryPath);
    const params = cbor.encode([new Uint8Array(code.buffer)]);

    const resp = await sendTrx(account, INIT_ACTOR_ADDRESS, INIT_ACTOR_INSTALL_METHOD, "0", params);

    const respBuffer = Buffer.from(resp, "base64");
    const [cid, isInstalled] = cbor.decode(Uint8Array.from(respBuffer));

    return [cid.toString(), isInstalled];
  }

  static load(address, { functions, types }) {
    const instance = new Contract();
    instance.address = address;

    functions.forEach(({ name, index, args, return: rtns }) => {
      instance.methods[name] = index;
      instance[name] = async (...fullArgs) => {
        console.log(`Call [${name}] - Index [${instance.methods[name]}]`);

        if (args.length == 0) console.log("No args");
        else
          args.forEach(({ name, type }, index) => {
            console.log(`Arg --> Name [${name}] - Type [${type}] - Value [${fullArgs[index + 2]}]`);
          });

        rtns.forEach((rtn) => console.log(`Return --> [${rtn.type}]`));

        const [from, value, ...txParams] = fullArgs;
        const params = cbor.encode(txParams);
        const resp = await sendTrx(from, instance.address, instance.methods[name], value, params);

        if (rtns.length === 0 && !!resp) throw new Error("some response data was not expected and received");
        if (rtns.length > 0 && !resp) throw new Error("some response data was expected but not received");

        if (rtns.length > 0) {
          const respBuffer = Buffer.from(resp, "base64");
          const decodedResp = cbor.decode(Uint8Array.from(respBuffer));

          if (!decodedResp instanceof Array)
            throw new Error("response data is not contained inside an array, and it should be");
          if (rtns.length !== decodedResp.length)
            throw new Error("the elements qty in the response are not equal to the ones defined on the ABI");

          checkTypes(rtns, decodedResp);

          const toReturn = rtns.map((rtn, index) => decodedResp[index]);

          if (toReturn.length === 1) return toReturn[0];
          return toReturn;
        }
      };
    });

    return instance;
  }
}

exports.Contract = Contract;
