function checkTypes(fields, values){
    fields.forEach(({type}, index) => {
        const rcvType = typeof values[index]
        if( rcvType !== type ) throw new Error(`value [${values[index]}] should be a [${type}], but it is a [${rcvType}]`)
    })
}

module.exports = {checkTypes}
