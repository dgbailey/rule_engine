
export function isUsingOwnership(accountDataApi){
    return accountDataApi.PROJECT_API.hasOwnership()
}

export function isUsingMetricAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.hasMetricAlert()
}

export function isUsingIssueAlerts(accountDataApi){
    return accountDataApi.PROJECT_API.hasIssueAlert()
}

export function isUsingIssueAssignment(accountDataApi){
    return accountDataApi.PROJECT_API.hasAssignment()
}

export function isUsingDashboards(accountDataApi){
    return accountDataApi.PROJECT_API.hasDashboards()
}