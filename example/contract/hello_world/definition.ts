type Account = { address: string; private_base64: string };

export interface Contract{
	new : (account: Account, value: string) => Promise<string>
	say_hello : (account: Account, value: string) => Promise<string>
}



