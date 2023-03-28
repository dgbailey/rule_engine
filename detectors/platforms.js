
import {PLATFORM} from "../types.js"


export function isPlatformAndroid(accountDataApi){     
    let projectPlatform = accountDataApi.PROJECT_API.getSdks()
    return projectPlatform.some((p) => p === PLATFORM.android)
}

export function isPlatformJavascript(accountDataApi){
    let projectPlatform = accountDataApi.PROJECT_API.getSdks()
    return projectPlatform.some((p) => p === PLATFORM.javascript)

}

export function isPlatformReactNative(accountDataApi){
    let projectPlatform = accountDataApi.PROJECT_API.getSdks()
    return projectPlatform.some((p) => p === PLATFORM["react-native"])
}
export function isPlatformIos(accountDataApi){
    //fix
    let projectPlatform = accountDataApi.PROJECT_API.getSdks()
    return projectPlatform.some((p) => p === PLATFORM.apple)

}
export function isPlatformMobile(accountDataApi){
    //hack for now
    return true
}

export function isPlatformFrontend(accountDataApi){
    //TODO:make this work correctly
    return false

}

export function isPlatformBackend(accoundDataApi){
    //TODO:make this work correctly
    return false
}