import { EVENT_TYPES, USER_TYPES, DEPENDENCY_TYPES, ISSUE_TYPES, ORG_ISSUE_TYPES } from './types.js';
import {RULES} from './rules.js';
/**
 * Rule engine that processes Account data
 * 
 * What we know today: Rules, Account data
 * - The engine evaluates all rules against account data in the order they are specified.
 * 
 */


export class Node {
    
    static bindExtension(extName,parent,extDirectory){
        //bind extension based on parent dependency
        
        
        if(parent != null){
           
            switch(extName){
                
                case DEPENDENCY_TYPES.issue:
                    if(parent.name === DEPENDENCY_TYPES.org) return extDirectory[DEPENDENCY_TYPES.org_issue];
                    else if(parent.name === DEPENDENCY_TYPES.project) return extDirectory[DEPENDENCY_TYPES.project_issue];
                    break;
                default:
                    return extDirectory[extName]
            }
        }
    }
    constructor(deps,body,priority,name,parent,extension){
        this.deps = deps;//deps can be null or children?
        this.body = body;
        this.priority = priority;
        this.name = name;// root or extname
        this.parent = parent;//can be null
        this.extension = extension;
        this.children = [];
    }
    ruleType(){
        //introspect rule type based on deps. Meant for identifying rules by top level dependencies (org vs project).
        const topLevelDeps = this._peekDeps();
        if(topLevelDeps.length === 1 && topLevelDeps[0] === DEPENDENCY_TYPES.org){
            return DEPENDENCY_TYPES.org
        }
        return DEPENDENCY_TYPES.project;
    }
    _peekDeps(){
        return Array.isArray(this.deps) ? this.deps : Object.keys(this.deps);
    }
    create(extDirectory){
        //returns reference to self (ROOT node)
        if(Array.isArray(this.deps)){
            //terminal leaf
            return
        }else{
            let extensions = Object.keys(this.deps);
           
            //take seed, create nodes & bind extensions
            for (const extName of extensions){

                const n = new Node(this.deps[extName],null,null,extName,this,Node.bindExtension(extName,this,extDirectory));
                this.children.push(n);
                
            }
            for (const node of this.children){
                node.create(extDirectory);
            }
            return this;

        }
       
    }
   
    evaluate(accountData){
      
        //each node evaluates itself against an associated extension + account data
        //each node can evaluate itself against results of children
        
        //very first node has no extensions? if name is root?
        
        let resultSelf = this.extension.evaluate(accountData,this.deps,{node:this});
        if(!resultSelf){
            //exit early
            return resultSelf
        }
        //now that extensions can take context should they use this to make more sophisticated decisions? Like looking at the name of a parent node for example to make org vs. project decisions
        for (let c of this.children){
            resultSelf = resultSelf & c.evaluate(accountData);
        }
        return resultSelf;
    }
}
export class Engine {
    /**
     * @param {Object} An Options object with the following properties
     * @param {array} ruleSet [] Rule 
     * @param {array} extensions [] Extension
     * @param {bool} debug Flag for debug output
     */
    
    constructor(engineOptions){
        this.extensions = this._createExtensionDirectory(engineOptions.extensions);
        //processing rules dependent on extension processing
        this.ruleSet = this._preprocessRules(engineOptions.ruleSet);
        this.debug = engineOptions.debug
    }

    _bindAPIS(project,org){
        return {PROJECT_API:project,ORG_API:org};
    }
    _createExtensionDirectory(rawExtensions){
       
        let dir = {};
        for (const ext of rawExtensions){
            dir[ext.dependency] = new ext();
        }
        
        return dir;
    }

    _preprocessRules(rawRuleSet){
        
        //do we need to preprocess for syntax errors or dupes?
        //TODO:check rules to see if level is specified?
        let processed = [];
        for (let rawRule of rawRuleSet){

            let root = new Node(rawRule.deps,rawRule.body,rawRule.priority,'root',null,new RootExtension());
            root.create(this.extensions);
                processed.push(root);

        }
     
        
        
        return processed
        
    }
   

  
    process(accountData){
        /**
         * @param {Array} projectData An array of Projects
         * @return {Object} An object {projectId:[Rule, ...]}
         */
        //process all account data instead of splitting
        //TODO: modify extensions to expect the API shape //TODO: This currently assumes no processing errors and a reliable dataset
        //TODO: Org apis & project apis will differ. Need a way of idenfitying this when applying rules
        // Specify at the Rule level: org | project
        // Have the engine guess? 
       // Not sure where to specify the organization vs project difference. if we do it in the rule we need to link this detail directly to the rule. Adding another dep array would only 
       // You run into trouble with descriptors being mismatched with issues. If I specify [org, project] for a dep array which issues match to these specifically? Matching sdk types currently assumes you either write separate rules or it is a logical conjunctive (AND). They author by nature isn't querying for data, they are writing content for a set of characteristics. The act seems to be naturally conjuctive. 
       //I guess it follows that any dependencies listed are all or nothing. [project, org] is not all or nothing. It is not evaluated in the same way as an sdk.
       // So what rule do I evaluate & what api do I call?

       //project vs org deps (separated at the api level)
       // deps:{ project:[sdk:[],issue:[]], org:[ issue:[]] }
       // if no tier 1 grouping assume project level outputs being written conjunctive. 
       // OR check for org level and projct level issue mix & incompatibilities
       // 
        let output = {};
        const projects = accountData.org.projects;
        const org = accountData.org;
       
        function outputHelper(ruleType,aggregator,rule,project){
            if( ruleType === DEPENDENCY_TYPES.project){
                
                if( !aggregator[project.name]) aggregator[project.name] = [];
                aggregator[project.name].push(rule);
               
            }else{
                if(aggregator[ruleType]){
                    aggregator[ruleType].push(rule);
                }else{
                    aggregator[ruleType] = [];
                    aggregator[ruleType].push(rule);
                }
            }
            
        }

        for(const r of this.ruleSet){
              
            this.debug && console.debug('level:[project]',r.deps);
            //bind APIS in expected shape for extensions that may need access to both.
            
            const ruleType = r.ruleType();
            
            for (const p of projects){
                
                const result = r.evaluate(this._bindAPIS(p,org));
             
                if(result){
                
                    outputHelper(ruleType,output,{body:r.body,priority:r.priority},p);

                } 
                    
            }
            
        }
        return output
    }
  
}
export class OrgExtension {
    static dependency = DEPENDENCY_TYPES.org;
    constructor(){

    }
    evaluate(accountData,depsArray,context={}){
       
        return true
    }
}

//Extension
/**
 * fn evaluate(accountData, ruleDepsArray) bool
 */
export class OrgIssueExtension {
    static dependency = DEPENDENCY_TYPES.org_issue; 
    constructor(){
       
    }
    evaluate(accountData, issueDepsArray,context = {}){
        /**
         * @param {Object} accountData An object representing API for org data
         */
        //do we assume we have just org rules at this point?
        let result = false;

        for (let issueType of issueDepsArray){
           if(issueType === ORG_ISSUE_TYPES['ecosystem.vcs.none']){
            if(!accountData.ORG_API.hasIntegrationVCS()) result = true;
           }
           
        }
        return result
    }
}

export class ProjectExtension {
    static dependency = DEPENDENCY_TYPES.project;
    constructor(){

    }
    evaluate(accountData, depsArray, context={}){
        return true
    }
}

export class RootExtension {
    static dependency = DEPENDENCY_TYPES.root;
    evaluate(accountData, depsArray, context={}){
        return true
    }
}

export class ProjectIssueExtension {
    //issue dependency needs a check at the extension of the history object to choose correct issue extension
    static dependency = DEPENDENCY_TYPES.project_issue;
    
    constructor(){
       
    }
    
   
    evaluate(accountData, depsArray, context={}){
        /**
         * @param {Object} accountData An object representing API for project data
         * @param {Array} depsArray An array of Rule dependencies
         * @param {Object} context A optional context with metadata from the rule tree
         * @return {boolean} Returns true or false if dependency present
         */

    
        let result = false;
        


        for (let issueType of depsArray){
            //TODO:look for commonalities to optimize this evaluation in future
            //if issue type is defined but not present in extension this should throw
            if (issueType === ISSUE_TYPES["dashboard.none"]){

            }
            else if (issueType === ISSUE_TYPES["release_health.environment.none"]){
                
                if(!accountData.PROJECT_API.hasEnv()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.ownership.none"]){
               
                if (!accountData.PROJECT_API.hasOwnership()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.metric_alerts.none"]){
               
                if (!accountData.PROJECT_API.hasMetricAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.issue_alerts.none"]){
               
                if (!accountData.PROJECT_API.hasIssueAlert()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.vcs.none"]){
               
                if (!accountData.PROJECT_API.hasIntegrationVCS()) result = true;
            }
            else if(issueType === ISSUE_TYPES["releases.artifacts.sourcemaps.none"]){
               
                if (!accountData.PROJECT_API.hasSourcemaps()) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.utilization.txn.base"]){
               
                if (accountData.PROJECT_API.hasBaseTransactions()) result = true;
            }
            else if(issueType === ISSUE_TYPES["dashboards.none"]){
               
                if (!accountData.PROJECT_API.hasDashboards()) result = true;
            }
            else if(issueType === ISSUE_TYPES["workflow.assignment.none"]){
               
                if (!accountData.PROJECT_API.hasAssignment()) result = true;
            }
            else if(issueType === ISSUE_TYPES["quota.dropped.errors.high"]){
               
                if (accountData.PROJECT_API.hasDropped()) result = true;
            }
            else if(issueType === ISSUE_TYPES["ecosystem.alerting.none"]){
               
                if (accountData.PROJECT_API.hasIntegrationsAlerting()) result = true;
            }
            else throw new Error(`Issue Extension did not find matching issue_type: ${issueType}`);
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


export class SdkExtension {
    /**
     * @return {boolean} Returns true or false if dependency present
     */
    static dependency = DEPENDENCY_TYPES.sdk;
    constructor(){
       
    }


   evaluate(accountData,ruleDepsArray,context){
       /**
        * 
        * @return {boolean} Returns true or false if dependency present
        */
   
    
    let expandedSet = new Set();//duplicates, user error?

    let accountSdks = accountData.PROJECT_API.getSdks();
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

export const mockAccount = {
    org:{
        hasIntegrationVCS:() => false,
        projects:[
            {   
                name:"test_name",
                getSdks:() => ['android','javascript','java'],
                hasOwnership:() => false,
                hasEnv:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                hasIntegrationVCS:() => false,
                hasIntegrationsAlerting:() => false,
                hasSourcemaps:() => false,
                hasBaseTransactions:() => true,
                hasDashboards:() => false,
                hasAssignment:() => false,
                hasDropped:() => true,
                hasIntegrationVCS:() => true,
            },
            {   
                name:"test_name_a",
                getSdks:() => ['android','javascript','java'],
                hasOwnership:() => false,
                hasEnv:() => false,
                hasMetricAlert:() => false,
                hasIssueAlert:() => false,
                hasIntegrationVCS:() => false,
                hasIntegrationsAlerting:() => false,
                hasSourcemaps:() => false,
                hasBaseTransactions:() => true,
                hasDashboards:() => false,
                hasAssignment:() => false,
                hasDropped:() => true,
                hasIntegrationVCS:() => true,
            }

        ]
    }
    
}


export const extensions = [RootExtension, SdkExtension, OrgExtension, ProjectExtension, OrgIssueExtension, ProjectIssueExtension];
export const EngineOptions = {
    debug:false,
    ruleSet:RULES,
    extensions:extensions
} 

export const RULE_ENGINE = new Engine(EngineOptions);


// exports.Engine = e;
