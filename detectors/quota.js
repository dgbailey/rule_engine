export function hasUtilizedBaseTxn(accountDataApi){
    return accountDataApi.PROJECT_API.hasBaseTransactions()
}

export function hasHighDroppedErrors(accountDataApi){
    return accountDataApi.PROJECT_API.hasDropped()
}
