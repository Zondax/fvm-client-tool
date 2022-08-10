type Account = { address: string; private_base64: string };

export interface Contract{
	new : (account: Account, value: string, args: newArgs) => Promise<string>
	GetName : (account: Account, value: string, args: GetNameArgs) => Promise<string>
	GetSymbol : (account: Account, value: string) => Promise<string>
	GetDecimal : (account: Account, value: string) => Promise<string>
	GetTotalSupply : (account: Account, value: string) => Promise<string>
	GetBalanceOf : (account: Account, value: string, args: GetBalanceOfArgs) => Promise<string>
	Transfer : (account: Account, value: string, args: TransferArgs) => Promise<string>
	Allowance : (account: Account, value: string, args: AllowanceArgs) => Promise<string>
	TransferFrom : (account: Account, value: string, args: TransferFromArgs) => Promise<string>
	Approval : (account: Account, value: string, args: ApprovalArgs) => Promise<string>
}

export type newArgs = { 
	name:string;
	symbol:string;
	decimal:number;
	totalSupply:BigInt;
	ownerAddr:string 
}
export type GetNameArgs = { 
	data:Param 
}
export type GetBalanceOfArgs = { 
	userAddr:string 
}
export type TransferArgs = { 
	receiverAddr:string;
	transferAmount:BigInt 
}
export type AllowanceArgs = { 
	ownerAddr:string;
	spenderAddr:string 
}
export type TransferFromArgs = { 
	ownerAddr:string;
	receiverAddr:string;
	transferAmount:BigInt 
}
export type ApprovalArgs = { 
	spenderAddr:string;
	newAllowance:BigInt 
}

export type Param = { 
	test: BigInt 
}