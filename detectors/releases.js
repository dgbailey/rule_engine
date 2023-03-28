
export function isSessionTracking(accountDataApi){
    return accountDataApi.PROJECT_API.hasSessions()
}

export function isUsingReleases(accountDataApi){
    return accountDataApi.PROJECT_API.hasReleases()
}

export function isUploadingArtifactsDsym(accountDataApi){
    return accountDataApi.PROJECT_API.hasDsyms()
}

export function isUploadingArtifactsProguard(accountDataApi){
    return accountDataApi.PROJECT_API.hasProguard()
}

export function isUsingEnvironments(accountDataApi){
    return accountDataApi.PROJECT_API.hasEnv()
}

export function isUploadingArtifactsSourcemaps(accountDataApi){
    return accountDataApi.PROJECT_API.hasSourcemaps()
}