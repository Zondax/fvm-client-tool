type Account = { address: string; private_base64: string };

export interface Contract{
	new : (account: Account, value: string) => Promise<string>
	say_hello : (account: Account, value: string, args: say_helloArgs) => Promise<string>
}

export type say_helloArgs = { 
	u64Array:BigInt[];
	stringArray:string[];
	u64Map:{[key:string]: BigInt};
	customArg:CustomArgument 
}

export type CustomArgument = { 
	argumentsArray: CustomArgument2[]
	argumentsMap: {[key:string]: CustomArgument2} 
}
export type CustomArgument2 = { 
	counterLong: BigInt
	counterShort: number
	message: string 
}