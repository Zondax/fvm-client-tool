type Account = { address: string; private_base64: string };

export interface Contract{
	new : (account: Account, value: string) => Promise<string>
	say_hello : (account: Account, value: string, args: say_helloArgs) => Promise<string>
}

export type say_helloArgs = { 
	data1:BigInt[];
	data2:string[];
	data3:{[key:string]: BigInt};
	data4:CustomArgument 
}

export type CustomArgument = { 
	field1: BigInt
	field2: number
	field3: string
	field4: CustomArgument2 
}
export type CustomArgument2 = { 
	field1: BigInt
	field2: number
	field3: string 
}