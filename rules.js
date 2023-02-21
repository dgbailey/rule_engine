
import { ISSUE_TYPES, ORG_ISSUE_TYPES } from "./types.js"
// Rule {
//     /**
//      * {string} body The outbound text
//      * {Object} deps The DEPENDENCY_TYPES of the outbound)
//      * {int} priority The integer priority 0 ... 10
//      */
// }






/**
 * Naming for product areas  
 * Workflow . (  alerts | assignment | ownership) . ( none | etc )
 * Releases . (environment | sessions | versioning | artifacts | ...) . (none | )
 * Quota . (filtered | dropped | utilization) . ( error | transaction ) . (high | base | low )
 * Dashboards . ( none )
 * Ecosystem . (vcs | issue_mgmt | alerting | ...) . (none)
 * SDK . (major | minor ) . ( update )
 */

// Dependencies
/**
 * These are any keys that are specified within deps:{}. They function to identify dependencies of the rule. The currently map to types of Extensions which specify the logic for evaluating dependencies agains account data. 
 */

// Issues:

// 1. Naming
//  <product area> . <feature subset> . < optional: data type descriptor> . <issue (some | none | high | low | etc )>
// 2. Adding to types.js, login for evaluation in project or org issue extensions (engine.js), 

/** Can I write a rule that depends on both some org and some project deps?
 * YES
 * // deps:{ project:{sdk:[],issue:[]}, org:{issue:[]}}
 * 
 * Rules are ultimately transformed into a tree that reflects nested dependencies. When a tree is built for a rule, each node binds to an extension. Later, when processing data, each node evaluates itself against account data & the logic + Types specified in the extension. The entire rule tree must resolve to <true> in order for a rule to apply --writing rules based on details of an account naturally conjunctive.
 * 
 *         root
 *        /    \
 *    project  org
 *     /   \      \
 *  sdk   issue  issue
 * 
 */

/**
 * Notes on syntax:
 * Currently rules must follow the syntax below. There is no syntax checking currently so undefined behavior is possible:
 * 
 * Top level fields:
 * // body:<string> 
 * 
 * // deps:{ project:{sdk:[],issue:[]}, org:{issue:[]}}
 *      Currently either project, org, or both top level keys must be supplied. 
 * 
 * // priority:<int>
 * 
 */



//Rules may be limited by the stage of account Data api. We could have a separate bank for ideation & manual lookup.
export const RULES = [
        {
            "body":"VCS allows organizations & their teams to triage more efficiently by adding commit metadata to Senry issues. We recommend configuring this when possible.",
            "deps":{"org":{"issue":[ORG_ISSUE_TYPES["ecosystem.vcs.none"]]}},
            "priority":0
        },
        {
            "body":"Specifying environments in SDK initialization can help you better understand & filter issues during your phased rollout.",
            "deps":{project:{"sdk":["mobile"],"issue":[ISSUE_TYPES["release_health.environment.none"]]}},
            "priority":10
        },
        {
            "body":"Crash free session tracking can be enhanced with real time session based alerting. Get notified via your preferred tool by leveraging out integrations platform.",
            "deps":{project:{"sdk":["mobile"],"issue":[ISSUE_TYPES["workflow.metric_alerts.none"],ISSUE_TYPES["ecosystem.alerting.none"]]}},
            "priority":10
        }
        ,
        {
            "body":"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release.",
            "deps":{project:{"sdk":["mobile"],"issue":[ISSUE_TYPES["workflow.issue_alerts.none"]]}},
            "priority":10
        },
        {
            "body":"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
            "deps":{project:{"sdk":["mobile"],"issue":[ISSUE_TYPES["workflow.ownership.none"],ISSUE_TYPES["ecosystem.vcs.none"]]}},
            "priority":10
        },
        {
            "body":"There are benefits to uploading sourcemaps directly to Sentry via our API. You can improve the consistency & reliability of human readable stacktraces in your project. Exposing sensitive URLs is generally not ideal.",
            "deps":{project:{"sdk":['javascript'],"issue":[ISSUE_TYPES["releases.artifacts.sourcemaps.none"]]}},
            "priority":10
        },
        {
            "body":"Our tracing product allows you to identify bottlenecks & correlate errors directly in the Senty UI. You have some projects that might be good candidates for this.",
            "deps":{project:{"sdk":['frontend','backend'],"issue":[ISSUE_TYPES["quota.utilization.txn.base"]]}},
            "priority":10
        },
        {
            "body":"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
            "deps":{project:{"sdk":['mobile'],"issue":[ISSUE_TYPES["dashboards.none"]]}},
            "priority":10
        },
        {
            "body":"Issues are best owned within Sentry. Assigning issues routes notifications and issues directly to those most apt to fix them. You can even have Sentry do this automatically for you.",
            "deps":{project:{"issue":[ISSUE_TYPES["workflow.assignment.none"]]}},
            "priority":10
        },
        {
            "body":"Dropping events can impact your visibility of issues. Consider using Discover to triage your noisiest issues or identify other good candidates for filtering.",
            "deps":{project:{"issue":[ISSUE_TYPES["quota.dropped.errors.high"]]}},
            "priority":10
        },
        
    ]

