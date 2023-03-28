
export function isIntegratedVcs(accountDataApi){
    return accountDataApi.PROJECT_API.hasIntegrationVCS()

}

export function isIntegratedAlerting(accountDataApi){
    return accountDataApi.PROJECT_API.hasIntegrationsAlerting()
}

export function isOrgIntegratedVcs(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationVCS()
}

export function isOrgIntegratedAlerting(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationsAlerting()
}

export function isOrgIntegratedSso(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationsSSO()
}