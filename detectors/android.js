
export function isInstrumentedHttpErrors(accountDataApi){
    return accountDataApi.PROJECT_API.hasAndroidHttp()
}

export function isInstrumentedDatabase(accountDataApi){
    return accountDataApi.PROJECT_API.hasAndroidDb()
}

export function isInstrumentedFileIo(accountDataApi){
    //need to check naming for this Project API
    return accountDataApi.PROJECT_API.hasFileIo()
}

export function isInstrumentedFragments(accountDataApi){
     //need to check naming for this Project API
    return accountDataApi.PROJECT_API.hasFragments()
}

export function isInstrumentedOkhttp(accoundDataApi){
    return accoundDataApi.PROJECT_API.hasOkhttp()
}
