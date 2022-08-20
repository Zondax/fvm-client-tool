import fs from "fs";
import * as cbor from "@ipld/dag-cbor";
import { CID } from "multiformats/cid";
import { sendTrx } from "./client";
import { attachMethods } from "./utils";
import { INIT_ACTOR_INSTALL_METHOD, INIT_ACTOR_ADDRESS, INIT_ACTOR_CREATE_METHOD } from "./constants";
import { ABI, Account } from "./types";

export class ContractManager {
  protected methods: { [key: string]: number } = {};
  protected address: string | null = null;
  protected cid: CID | null = null;

  static async install(account: any, binaryPath: string): Promise<{ cid: CID; isInstalled: boolean }> {
    if (!fs.existsSync(binaryPath)) throw new Error(`file ${binaryPath} does not exist`);
    const code = fs.readFileSync(binaryPath);
    const params = cbor.encode([new Uint8Array(code.buffer)]);

    const { Return: resp } = await sendTrx(account, INIT_ACTOR_ADDRESS, INIT_ACTOR_INSTALL_METHOD, "0", params);

    const respBuffer = Buffer.from(resp, "base64");
    const [cid, isInstalled] = cbor.decode(Uint8Array.from(respBuffer));

    return { cid, isInstalled };
  }

  static load<T>(address: string, { functions, types }: ABI): T {
    const instance = new ContractManager();
    instance.address = address;

    attachMethods(instance, functions, types);

    return instance as any as T;
  }

  static create<T>(cid: CID, { functions, types }: ABI): T {
    const instance = new ContractManager();
    instance.cid = cid;

    attachMethods(instance, functions, types);

    return instance as any as T;
  }

  setContractAddress = (address: string): void => {
    if (this.address) throw new Error("the contract address cannot be changed");
    this.address = address;
  };

  getContractAddress = (): string => {
    if (!this.address) throw new Error("the contract address is not there yet");
    return this.address;
  };
}
