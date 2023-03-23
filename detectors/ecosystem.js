export function hasIntegrationVcs(accountDataApi){
    return accountDataApi.PROJECT_API.hasIntegrationVCS()

}

export function hasIntegrationsAlerting(accountDataApi){
    return accountDataApi.PROJECT_API.hasIntegrationsAlerting()
}

export function hasOrgIntegrationVcs(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationVCS()
}

export function hasOrgIntegrationsAlerting(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationsAlerting()
}

export function hasOrgIntegrationsSso(accountDataApi){
    return accountDataApi.ORG_API.hasIntegrationsSSO()
}