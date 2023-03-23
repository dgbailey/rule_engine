export function hasSessionTracking(accountDataApi){
    return accountDataApi.PROJECT_API.hasSessions()
}

export function hasVersionedReleases(accountDataApi){
    return accountDataApi.PROJECT_API.hasReleases()
}

export function hasArtifactsDsym(accountDataApi){
    return accountDataApi.PROJECT_API.hasDsyms()
}

export function hasArtifactsProguard(accountDataApi){
    return accountDataApi.PROJECT_API.hasProguard()
}

export function hasEnvironments(accountDataApi){
    return accountDataApi.PROJECT_API.hasEnv()
}

export function hasArtifactsSourcemaps(accountDataApi){
    return accountDataApi.PROJECT_API.hasSourcemaps()
}