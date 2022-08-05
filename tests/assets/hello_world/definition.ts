import { Account } from "../../../dist/types";

export interface Contract {
  new: (account: Account, value: string) => Promise<[string, string]>;
  say_hello: (account: Account, value: string) => Promise<string>;
}
