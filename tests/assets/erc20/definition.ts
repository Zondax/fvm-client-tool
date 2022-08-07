import { Account } from "../../../dist/types";

export interface Contract {
  new: (
    account: Account,
    value: string,
    name: string,
    symbol: string,
    decimal: number,
    totalSupply: string,
    ownerAddr: string
  ) => Promise<[string, string]>;
  GetName: (account: Account, value: string, data: Param) => Promise<string>;
  GetSymbol: (account: Account, value: string) => Promise<string>;
  GetDecimal: (account: Account, value: string) => Promise<string>;
  GetTotalSupply: (account: Account, value: string) => Promise<string>;
  GetBalanceOf: (account: Account, value: string, userAddr: string) => Promise<string>;
  Transfer: (account: Account, value: string, receiverAddr: string, transferAmount: string) => Promise<string>;
  Allowance: (account: Account, value: string, ownerAddr: string, spenderAddr: string) => Promise<string>;
  TransferFrom: (
    account: Account,
    value: string,
    ownerAddr: string,
    receiverAddr: string,
    transferAmount: string
  ) => Promise<string>;
  Approval: (account: Account, value: string, spenderAddr: string, newAllowance: string) => Promise<string>;
}
export type Param = { test: number };
