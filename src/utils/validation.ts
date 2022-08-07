// @ts-ignore
import {ArgumentABI, ParamsType} from "../types";

const UNSIGNED_INT_MAX={ "u8": 255, "u16": 65535, "u32": 4294967295, "u64": BigInt("18446744073709551615") }
const SIGNED_INT_MAX = { "i8": 127, "i16": 32767, "i32": 2147483647, "i64": BigInt("9223372036854775807") }

export const parseAndValidateArgs = (args: ArgumentABI[], txParams: any[]): any[] => {
    if( args.length != txParams.length ) throw new Error(`the arguments should be ${args.length}`)
    return args.map(({type, name}, index)=> {
        return parseAndValidateArg(name, type, txParams[index]);
    })
}

export const parseAndValidateArg = (name: string, type: ParamsType, value: any):any => {
    let parsedNumber: number, parsedBigInt: BigInt;
    switch (type){
        case "u8":
        case "u16":
        case "u32":
            parsedNumber = parseInt(value);
            if(isNaN(parsedNumber)) throw new Error(`param ${name} should be a integer`)
            if( parsedNumber > UNSIGNED_INT_MAX[type] || parsedNumber < 0 ) throw new Error(`param ${name} should be a ${type}`)
            return parsedNumber;

        case "i8":
        case "i16":
        case "i32":
            parsedNumber = parseInt(value);
            if(isNaN(parsedNumber)) throw new Error(`param ${name} should be a integer`)
            if( parsedNumber > SIGNED_INT_MAX[type] || parsedNumber < (-1*SIGNED_INT_MAX[type]) ) throw new Error(`param ${name} should be a ${type}`)
            return parsedNumber;

        case "u64":
            if(typeof value != "string") throw new Error(`param ${name} should be a number (as string)`)
            parsedBigInt = BigInt(value);
            if( parsedBigInt > UNSIGNED_INT_MAX[type] || parsedBigInt < BigInt(0) ) throw new Error(`param ${name} should be a ${type}`)
            return parsedBigInt;

        case "i64":
            if(typeof value != "string") throw new Error(`param ${name} should be a number (as string)`)
            parsedBigInt = BigInt(value);
            if( parsedBigInt > SIGNED_INT_MAX[type] || parsedBigInt < (SIGNED_INT_MAX[type] * BigInt(-1))) throw new Error(`param ${name} should be a ${type}`)
            return parsedBigInt;

        case "string":
            if(typeof value != "string") throw new Error(`param ${name} should be a string`)
            return value;

        default:
            return value;
    }
}
