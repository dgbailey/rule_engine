const EVENT_TYPES = {
    error:'error',
    transaction:'transaction'
}

const DEPENDENCY_TYPES = {
    sdk:'sdk',
    event:'event',
    issue:'issue',
    account:'account',
    team:'team',
}

class Engine {
    /**
     * 
     * @param {array} ruleSet [] Rule
     * @param {array} plugins [] Plugin
     * @param {bool} debug Flag for debug output
     */
    constructor(engineOptions){
        
        this.ruleSet = this.parseRuleSyntax(engineOptions.ruleSet);
        this.plugins = engineOptions.plugins;
        this.debug = engineOptions.debug
    }


    parseRuleSyntax(rawRuleSet){
        //do we need to check for syntax errors or dupes? RuleParser?
        
        return rawRuleSet
        
    }

    process(accountData){
        /**
         * @param {object} accountData An object describing raw & computed account data 
         * return [] Rule Returns applicable rules
         */
        let output = [];
    
        for(const r of this.ruleSet){
            this.debug && console.debug(r.deps);
            if(this.applyPlugins(accountData,this.plugins,r.deps) === true){
                //TODO:add rule to output in/priority order
                output.push(r);
            }
        }
        return output
    }
   
    applyPlugins(accountData,pluginArray,ruleDeps){
       
        // any applicable plugins that return false violate dependency reqs
        // perhaps register plugins as check agains missing (if rules specify)
        let result = true;
        for (let plugin of pluginArray){
            //this leaves the potential for some rules to not be applied if plugin is missing from [Plugins]
            if(plugin.dependency in ruleDeps){
               result = result && plugin.evaluate(accountData,ruleDeps[plugin.dependency]);
               this.debug && console.debug('result',result);
            }
            
        }
        return result

    }
}
//on demand spend? & noise?
const ISSUE_TYPES = {
    'release_health.versioning':'release_health.versioning',
    'release_health.environment.none':'release_health.environment.none',
    'quota.txn.high':'quota.txn.high',
    'quota.txn.low':'quota.txn.low',
    'quota.txn.base':'quota.txn.base',
    'assignment.some':'assignment.some',
    'assignment.none':'assignment.none',
    'ownership.some':'ownership.some',
    'ownership.none':'ownership.none',
    'dashboard.none':'dashboard.none',
    'alerts.metric.none':'alerts.metric.none',
    'alerts.issue.none':'alerts.issue.none',
    'integrations.vcs.none':'integrations.vcs.none',
    'artifacts.sourcemaps.none':'artifacts.sourcemaps.none',
    'sdk.update.major':'sdk.update.major'
}

//Plugin
/**
 * fn evaluate(accountData, ruleDepsArray) bool
 */

class IssuePlugin {
    
    constructor(){
        this.dependency = DEPENDENCY_TYPES.issue;
    }
   
    evaluate(accountData, issueDepsArray){
        /**
         * 
         * @return {boolean} Returns true or false if dependency present
         */

    
        let result = false;
       
        for (let issueType of issueDepsArray){
            //TODO:look for commonalities to optimize this evaluation in future
            //if plugin isn't defined but rule dependency is present this should throw
            if (issueType === ISSUE_TYPES["dashboard.none"]){

            }
            else if (issueType === ISSUE_TYPES["release_health.environment.none"]){
                
                if(!accountData.hasEnv()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ownership.none"]){
               
                if (!accountData.hasOwnership()) result = true;
            }
            else if(issueType === ISSUE_TYPES["alerts.metric.none"]){
               
                if (!accountData.hasMetricAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["alerts.issue.none"]){
               
                if (!accountData.hasIssueAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["integrations.vcs.none"]){
               
                if (!accountData.hasIntegrationVCS()) result = true;
            }
            else if(issueType === ISSUE_TYPES["artifacts.sourcemaps.none"]){
               
                if (!accountData.hasSourcemaps()) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.txn.base"]){
               
                if (accountData.hasBaseTransactions()) result = true;
            }
            else if(issueType === ISSUE_TYPES["dashboard.none"]){
               
                if (!accountData.hasDashboards()) result = true;
            }
            else if(issueType === ISSUE_TYPES["assignment.none"]){
               
                if (!accountData.hasAssignment()) result = true;
            }
            else throw new Error(`Issue plugin did not find matching Issue dep: ${issueType}`);
        }
        return result
    }
}

const SDK_TYPES = {
    mobile:'mobile',
    javascript:'javascript',
    ios:'ios',
    backend:'backend',
    frontend:'frontend'
}
const SDK_GROUP = {
    mobile:['android','ios','react-native'],
    backend:['python','java','golang','.NET'],
    frontend:['javascript','javascript.react','javascript.vue']
}


class SdkPlugin {
    /**
     * @return {boolean} Returns true or false if dependency present
     */
    constructor(){
        this.dependency = DEPENDENCY_TYPES.sdk;
    }


   evaluate(accountData,ruleDepsArray){
       /**
        * 
        * @return {boolean} Returns true or false if dependency present
        */
   
    
    let expandedSet = new Set();//duplicates, user error?

    let accountSdks = accountData.getSdks();
    function helper(accountSdks,value){
        return accountSdks.includes(value);
    }
    if(ruleDepsArray.includes(SDK_TYPES.mobile)){
        SDK_GROUP.mobile.forEach(v => {
            if(helper(accountSdks,v)) expandedSet.add(v);
        });
    }
    if(ruleDepsArray.includes(SDK_TYPES.backend)){
       SDK_GROUP.backend.forEach(v => {
        if(helper(accountSdks,v)) expandedSet.add(v);
    });
    }
    ruleDepsArray.forEach(v => {
        //thought about sdk.group as a new dependency type to avoid this unnecessary step removing pollution 
        if (SDK_TYPES.mobile !== v && SDK_TYPES.backend !== v && SDK_TYPES.frontend !== v) expandedSet.add(v);
        
    });

    const a = Array.from(expandedSet);
    if(a.length !== 0 && isSubset(accountSdks,a)){
        return true;
    }
    return false
    

   }


}

function isSubset(dep1,dep2){
    //checks if dep2 is a subset of dep1
    return dep2.every(value => dep1.includes(value));
}

const mockAccount = {
    getSdks:() => ['android','javascript','java'],
    hasOwnership:() => false,
    hasEnv:() => false,
    hasMetricAlert:() => false,
    hasIssueAlert:() => false,
    hasIntegrationVCS:() => false,
    hasSourcemaps:() => false,
    hasBaseTransactions:() => true,
    hasDashboards:() => false,
    hasAssignment:() => false,
}
const {RULES:rawRules} = require('./rules');
const plugins = [new SdkPlugin(), new IssuePlugin()];
const EngineOptions = {
    debug:false,
    ruleSet:rawRules,
    plugins:plugins
} 
const e = new Engine(EngineOptions);
// console.log("outbound output", e.process(mockAccount));

exports.Engine = e;
