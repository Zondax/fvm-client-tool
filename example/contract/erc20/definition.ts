type Account = { address: string; private_base64: string };

export interface Contract{
	new : (account: Account, value: string, name:string, symbol:string, decimal:number, totalSupply:BigInt, ownerAddr:string) => Promise<string>
	GetName : (account: Account, value: string, data:Param) => Promise<string>
	GetSymbol : (account: Account, value: string, ) => Promise<string>
	GetDecimal : (account: Account, value: string, ) => Promise<string>
	GetTotalSupply : (account: Account, value: string, ) => Promise<string>
	GetBalanceOf : (account: Account, value: string, userAddr:string) => Promise<string>
	Transfer : (account: Account, value: string, receiverAddr:string, transferAmount:BigInt) => Promise<string>
	Allowance : (account: Account, value: string, ownerAddr:string, spenderAddr:string) => Promise<string>
	TransferFrom : (account: Account, value: string, ownerAddr:string, receiverAddr:string, transferAmount:BigInt) => Promise<string>
	Approval : (account: Account, value: string, spenderAddr:string, newAllowance:BigInt) => Promise<string>
}
export type Param = { test: BigInt }