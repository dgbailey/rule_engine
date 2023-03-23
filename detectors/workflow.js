

export function hasAnyOwnership(accountDataApi){
    return accountDataApi.PROJECT_API.hasOwnership()
}

export function hasAnyMetricAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.hasMetricAlert()
}

export function hasAnyIssueAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.hasIssueAlert()
}

export function hasIssueAssignment(accountDataApi){
    return accountDataApi.PROJECT_API.hasAssignment()
}

export function hasDashboards(accountDataApi){
    return accountDataApi.PROJECT_API.hasDashboards()
}