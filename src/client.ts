// @ts-ignore
import { FilecoinRPC, transactionSign } from "@zondax/filecoin-signing-tools/js";

import { Account } from "./types";

let NODE_URL = "";
let NODE_TOKEN = "";

export function init(url: string, token: string) {
  NODE_URL = url;
  NODE_TOKEN = token;
}

export async function sendTrx(from: Account, to: string, method: number, value: string, params: Uint8Array) {
  const filRPC = new FilecoinRPC({ url: NODE_URL, token: NODE_TOKEN });
  const nonceResp = await filRPC.getNonce(from.address);
  const nonce = nonceResp.result;

  let tx = {
    From: from.address,
    To: to,
    Value: value,
    Method: method,
    Params: Buffer.from(params).toString("base64"),
    Nonce: nonce,
    GasFeeCap: "0",
    GasPremium: "0",
    GasLimit: 0,
  };

  tx = await getFee(filRPC, tx);

  const signedTx = transactionSign(tx, from.private_base64);

  const sentTx = await filRPC.sendSignedMessage({
    Message: tx,
    Signature: signedTx.Signature,
  });

  const { result } = sentTx;
  if (!result) throw new Error("response was not received");

  const { Receipt, ReturnDec } = result;
  if (!Receipt) throw new Error("receipt was not received");

  const { Return, ExitCode } = Receipt;
  if (ExitCode != 0) throw new Error(`response code is ${ExitCode}`);

  return { Return, ReturnDec };
}

async function getFee(filRPC: any, tx: any) {
  const fees = await filRPC.getGasEstimation({ ...tx });
  const { error, result } = fees;
  if (error) throw new Error(JSON.stringify(error));

  if (!result) throw new Error("fees were not received");

  const { GasFeeCap, GasPremium, GasLimit } = result;
  if (!GasFeeCap) throw new Error("GasFeeCap was not received");
  if (!GasPremium) throw new Error("GasPremium was not received");
  if (!GasLimit) throw new Error("GasLimit was not received");

  tx = {
    ...tx,
    GasFeeCap,
    GasPremium,
    GasLimit,
  };

  return tx;
}
