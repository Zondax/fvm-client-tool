interface Contract{
	GetName : (data:Param) => string
	GetSymbol : () => string
	GetDecimal : () => string
	GetTotalSupply : () => string
	GetBalanceOf : (userAddr:string) => string
	Transfer : (receiverAddr:string, transferAmount:number) => string
	Allowance : (ownerAddr:string, spenderAddr:string) => string
	TransferFrom : (ownerAddr:string, receiverAddr:string, transferAmount:number) => string
	Approval : (spenderAddr:string, newAllowance:number) => string
}
type Param = { test: number }