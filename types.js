

const SDK = {
    mobile:'mobile',
    javascript:"javascript",
    ios:"ios",
    backend:"backend"
}
const EVENT_TYPES = {
    error:'error',
    transaction:'transaction'
}

const ISSUE_TYPES = {
    'release_health.versioning':'release_health.versioning',
    'release_health.environment.none':'release_health.environment.none',
    'quota.high':'quota.high',
    'quita.low':'quota.low',
    'assignment.some':'assignment.some',
    'assignment.none':'assignment.none',
    'ownership.some':'ownership.some',
    'ownership.none':'ownership.none',
    'dashboard.none':'dashboard.some',
    //alerts.metric.none
    //alerts.issue.none
    //integrations.vcs.none
    //integrations.alerting.none
}

const SDK_GROUP = {
    mobile:['android','ios','cordova'],
    backend:['python','java','go']
}

const DEPENDENCY_TYPES = {
    sdk:'sdk',
    event:'event',
    issue:'issue',
    account:'account',
    team:'team',

}


const rawRules = require('./rules.json');


// class Rule {
//     /**
//      * @param {string} body The outbound text
//      * @param {Object} deps The DEPENDENCY_TYPES of the outbound)
//      * @param {int} priority The integer priority 0 ... 10
//      */

//     //TODO: static utilities
//     constructor(body,deps,priority){
//         this.deps = deps;
//         this.body = body;
//         this.priority = priority ?? 10;
//     }

// }

// class RuleParser {
//     constructor(){

//     }
// }

class Engine {
    /**
     * 
     * @param {array} ruleSet [] Rule
     * @param {object} accountData An object describing raw & computed account data
     * @param {array} plugins [] Plugin
     */
    constructor(rawRuleSet,accountData,plugins){
        this.ruleSet = this.parseRuleSyntax(rawRuleSet);
        this.accountData = accountData;
        this.plugins = plugins;
    }

    //TODO: Evalute each rule's dependencies against accountData

    parseRuleSyntax(rawRuleSet){
        //do we need to check for syntax errors or dupes? RuleParser?
        
        return rawRuleSet['rules'];
        
    }

    process(){
        /**
         * return [] Rule Returns applicable rules
         */
        let output = [];
        for(const r of this.ruleSet){
            console.log(r.deps);
            if(this.applyPlugins(this.plugins,r.deps) === true){
                //add rule to some output w/priority
                output.push(r);
            }
        }
        return output
    }
    //Should accountData just have getters and setters

    applyPlugins(pluginArray,ruleDeps){
       
        // any applicable plugins that return false violate dependency reqs
        // perhaps register plugins as check agains missing (if rules specify)
        let result = true;
        for (let plugin of pluginArray){
            //this leaves the potential for some rules to not be applied if plugin is missing from [Plugins]
            if(plugin.dependency in ruleDeps){
               result = result && plugin.evaluate(this.accountData,ruleDeps[plugin.dependency]);
               //perhaps plugin can ve stateless meh we need state
               console.log('result',result);
            }
            
        }
        return result

    }
}


class IssuePlugin {
    
    constructor(){
        this.dependency = DEPENDENCY_TYPES.issue;
    }
   
    evaluate(accountData, issueDepsArray){
        /**
         * 
         * @return {boolean} Returns true or false if dependency present
         */
        console.log("applying plugin",this.dependency,accountData,issueDepsArray);

        //what api do I need from account data to evaluate each type of issue? A really long switch 
        //My deps array dictates the issues?
        let result = false;
        //For each in issue rule, query the data api to assess
        for (let issueType of issueDepsArray){
           console.log('issueType',issueType)
            if (issueType === ISSUE_TYPES["dashboard.none"]){

            }
            else if (issueType === ISSUE_TYPES["release_health.environment.none"]){
                
                if(!accountData.hasEnv()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ownership.none"]){
               
                if (!accountData.hasOwnership()) result = true;
            }
            else throw new Error(`Issue plugin did not find matching Issue dep: ${issueType}`);
        }
        return result
    }
}

class SdkPlugin {
    /**
     * @return {boolean} Returns true or false if dependency present
     */
    constructor(){
        this.dependency = DEPENDENCY_TYPES.sdk;
    }
    //if it is mobile use the superset
    //else go through 
   //set equivalence or subset


   evaluate(accountData,ruleDepsArray){
       /**
        * 
        * @return {boolean} Returns true or false if dependency present
        */
    //check set equivalence or subset
    //assumes no dupes
    console.log("applying plugin",this.dependency,accountData,ruleDepsArray)
    
    let expandedSet = new Set();

    let accountSdks = accountData.getSdks();
    function helper(accountSdks,value){
        return accountSdks.includes(value);
    }
    if(ruleDepsArray.includes(SDK.mobile)){
        console.log("has mobile");
        SDK_GROUP.mobile.forEach(v => {
            if(helper(accountSdks,v)) expandedSet.add(v);
        });
    }
    if(ruleDepsArray.includes(SDK.backend)){
       SDK_GROUP.backend.forEach(v => {
        if(helper(accountSdks,v)) expandedSet.add(v);
    });
    }
    ruleDepsArray.forEach(v => {
        if (!SDK.mobile === v) expandedSet.add(v);
        if (!SDK.backend === v) expandedSet.add(v);
    });

    const a = Array.from(expandedSet);
    console.log('expanded set',a);
    if(a.length !== 0 && isSubset(accountSdks,a)){
        console.log('returning true for expanded set')
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
    hasEnv:() => false
}
const plugins = [new SdkPlugin(), new IssuePlugin()]; //if plugin isn't defined but rule is present this should throw
const e = new Engine(rawRules,mockAccount,plugins);
console.log("outbound output", e.process());

