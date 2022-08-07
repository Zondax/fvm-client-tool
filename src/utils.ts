import * as cbor from "@ipld/dag-cbor";
import { sendTrx } from "./client";
import { INIT_ACTOR_ADDRESS, INIT_ACTOR_CREATE_METHOD } from "./constants";
import { ArgumentABI, FieldABI, FunctionABI, ReturnABI } from "./types";
import {parseAndValidateArgs} from "./utils/validation";

function attachConstructor(instance: any, name: string, args: ArgumentABI[], rtns: ReturnABI[]) {
  instance[name] = async (...fullArgs: any[]) => {
    if (instance.address)
      throw new Error("you cannot create a new instance because this object has already one attached");

    if (!instance.cid) throw new Error("cid is not present");

    const [from, value, ...txParams] = fullArgs;

    const params = cbor.encode(parseAndValidateArgs(args, txParams));
    const fullParams = cbor.encode([instance.cid, Buffer.from(params)]);
    const {
      ReturnDec: { IDAddress, RobustAddress },
    } = await sendTrx(from, INIT_ACTOR_ADDRESS, INIT_ACTOR_CREATE_METHOD, value, fullParams);

    instance.address = IDAddress;

    const resp = Buffer.from(cbor.encode([IDAddress, RobustAddress])).toString("base64");
    return validateResponse(rtns, resp);
  };
}

function attachMethod(instance: any, name: string, args: ArgumentABI[], rtns: ReturnABI[]) {
  instance[name] = async (...fullArgs: any[]) => {
    if (!instance.address)
      throw new Error(
        "you need to create a new instance of the smart contract first or load the address of an existing one"
      );

    const [from, value, ...txParams] = fullArgs;

    const params = cbor.encode(parseAndValidateArgs(args, txParams));
    const { Return: resp } = await sendTrx(from, instance.address, instance.methods[name], value, params);

    return validateResponse(rtns, resp);
  };
}

export function attachMethods(instance: any, functions: FunctionABI[], types: FieldABI[]) {
  functions.forEach(({ name, index, args, return: rtns }) => {
    instance.methods[name] = index;
    if (name === "new" && index === 1) attachConstructor(instance, name, args, rtns);
    else attachMethod(instance, name, args, rtns);
  });
}

function validateResponse(rtns: ReturnABI[], resp: string) {
  if (rtns.length === 0 && !!resp) throw new Error("some response data was not expected and received");
  if (rtns.length > 0 && !resp) throw new Error("some response data was expected but not received");

  if (rtns.length > 0) {
    const respBuffer = Buffer.from(resp, "base64");
    const decodedResp = cbor.decode(Uint8Array.from(respBuffer));

    if (!(decodedResp instanceof Array))
      throw new Error("response data is not contained inside an array, and it should be");
    if (rtns.length !== decodedResp.length)
      throw new Error("the elements qty in the response are not equal to the ones defined on the ABI");

    checkTypes(rtns, decodedResp);

    const toReturn = rtns.map((rtn, index) => decodedResp[index]);

    if (toReturn.length === 1) return toReturn[0];
    return toReturn;
  }
}

function checkTypes(fields: ReturnABI[], values: any[]) {
  fields.forEach(({ type }, index) => {
    const rcvType = typeof values[index];
    if (rcvType !== type) throw new Error(`value [${values[index]}] should be a [${type}], but it is a [${rcvType}]`);
  });
}
