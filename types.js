
export const EVENT_TYPES = {
    error:'error',
    transaction:'transaction'
}

export const USER_TYPES = {
    'team.size.small':'team.size.small',
    'team.size.large':'team.size.large',
}

export const DEPENDENCY_TYPES = {
    root:'root',
    sdk:'sdk',
    event:'event',
    issue:'issue',
    account:'account',
    team:'team',
    org:'org',
    project:'project',
    org_issue:'org_issue',
    project_issue:'project_issue'
}
export const LEVEL_TYPES = {
    org:'org',
    project:'project'
}
export const ORG_ISSUE_TYPES = {
    'ecosystem.vcs.none':'ecosystem.vcs.none' 
}


export const ISSUE_TYPES = {
    'releases.versioning':'releases.versioning',
    'releases.environment.none':'releases.environment.none',
    'quota.txn.high':'quota.txn.high',
    'quota.txn.low':'quota.txn.low',
    'quota.utilization.txn.base':'quota.utilization.txn.base',
    'quota.dropped.errors.high':'quota.dropped.errors.high',
    'quota.errors.high':'quota.errors.high',
    'quota.errors.low':'quota.erros.low',
    'workflow.assignment.some':'workflow.assignment.some',
    'workflow.assignment.none':'workflow.assignment.none',
    'workflow.ownership.some':'workflow.ownership.some',
    'workflow.ownership.none':'workflow.ownership.none',
    'dashboards.none':'dashboards.none',
    'workflow.metric_alerts.none':'workflow.metric_alerts.none',
    'workflow.issue_alerts.none':'workflow.issue_alerts.none',
    'ecosystem.vcs.none':'ecosystem.vcs.none',
    'ecosystem.alerting.none':'ecosystem.alerting.none',
    'releases.artifacts.sourcemaps.none':'releases.artifacts.sourcemaps.none',
    'sdk.major.update':'sdk.major.update',
    'release_health.environment.none':'release_health.environment.none'
    
}