

const SDK = {
    mobile:'mobile',
    javascript:"javascript",
    ios:"ios",
    backend:"backend"
}

const SDK_GROUP = {
    mobile:['android','ios','cordova'],
    backend:['python','java','go']
}

const DEPENDENCIES = {
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
//      * @param {Object} deps The dependencies of the outbound)
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
            if(this.applyPlugins(this.plugins,r.deps) == true){
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
        let result = false;
        for (let plugin of pluginArray){
         
            if(plugin.dependency in ruleDeps){
               result = plugin.evaluate(this.accountData,ruleDeps[plugin.dependency]);
               //perhaps plugin can ve stateless meh we need state
            }
            
        }
        return result

    }
}

class Plugin {
    /**
     * @return {boolean} Returns true or false if dependency present
     */
}

class SDKPLUGIN {
    constructor(){
        this.dependency = DEPENDENCIES.sdk;
    }
    //if it is mobile use the superset
    //else go through 
   //set equivalence or subset


   evaluate(accountData,ruleDepsArray){
    //check set equivalence or subset
    //assumes no dupes
    console.log("applying plugin",accountData,ruleDepsArray)
    
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
    
    if(!a.length ===0 && emisSubset(accountSdks,a)){
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
    getSdks:() => ['android','javascript','java']
}
const plugins = [new SDKPLUGIN()]; //if plugin isn't defined but rule is present this should throw
const e = new Engine(rawRules,mockAccount,plugins);
console.log("outbound output", e.process());

