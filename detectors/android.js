/**
 * Detector functions follow this signature
 * detector ( accountDataApi ) return bool
 */

export function hasInstrumentationHttpErrors(accountDataApi){
    return accountDataApi.PROJECT_API.hasAndroidHttp()
}

export function hasInstrumentationDatabase(accountDataApi){
    return accountDataApi.PROJECT_API.hasAndroidDb()
}

export function hasInstrumentationFileIo(accountDataApi){
    //need to check naming for this Project API
    return accountDataApi.PROJECT_API.hasFileIo()
}

export function hasInstrumentationFragments(accountDataApi){
     //need to check naming for this Project API
    return accountDataApi.PROJECT_API.hasFragments()
}

export function hasOkhttp(accoundDataApi){
    return accoundDataApi.PROJECT_API.hasOkhttp()
}
