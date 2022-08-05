const cbor = require("@ipld/dag-cbor");
const { sendTrx } = require("./client")

class Contract{
    methods = {}
    address = {}

    static init(address, {functions, types}) {
        const instance = new Contract()
        instance.address = address

        functions.forEach( ( {name, index, args, return: rtns} ) => {
            instance.methods[name] = index
            instance[name] = async (...rcvArgs) => {
                console.log(`Call [${name}] - Index [${instance.methods[name]}]`)

                if(args.length == 0)
                    console.log( "No args")
                else
                    args.forEach( ({name, type}, index) => {
                        console.log( `Arg --> Name [${name}] - Type [${type}] - Value [${rcvArgs[index+1]}]`)
                    })

                rtns.forEach(( rtn ) => console.log(`Return --> [${rtn.type}]`))

                const from = rcvArgs[0]
                const params = cbor.encode([]);
                const resp = await sendTrx(from, instance.address, instance.methods[name], params)


                if( rtns.length === 0 && !!resp ) throw new Error("some response data was not expected and received")
                if( rtns.length > 0 && !resp ) throw new Error("some response data was expected but not received")

                if( rtns.length > 0){
                    const respBuffer = Buffer.from(resp, "base64")
                    const decodedResp = cbor.decode(Uint8Array.from(respBuffer));
                    const toReturn = rtns.map((rtn, index) => decodedResp[index])

                    if( toReturn.length === 1 ) return toReturn[0]
                    return toReturn
                }
            }
        })

        return instance
    }
}

exports.Contract = Contract
