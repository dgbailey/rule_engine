
// Rule {
//     /**
//      * {string} body The outbound text
//      * {Object} deps The DEPENDENCY_TYPES of the outbound)
//      * {int} priority The integer priority 0 ... 10
//      */
// }
const RULES = [
        {
            "body":"Specifying environments help to better understand & filter issues during your phased rollout.",
            "deps":{"sdk":["mobile"],"issue":["release_health.environment.none"]},
            "priority":10
        },
        {
            "body":"Improve your session tracking with real time session based alerting. Get notified ",
            "deps":{"sdk":["mobile"],"issue":["alerts.metric.none"]},
            "priority":10
        }
        ,
        {
            "body":"Velocity based issue alerting, regressions, or for fresh issues from the most recent release are all alert types that your mobile team can take advantage of during a release.",
            "deps":{"sdk":["mobile"],"issue":["alerts.issue.none"]},
            "priority":10
        },
        {
            "body":"Specifying ownership rules or integrating suspect commits improves context during triage. This is a quick win.",
            "deps":{"sdk":["mobile"],"issue":["ownership.none","integrations.vcs.none"]},
            "priority":10
        },
        {
            "body":"There are benefits to uploading sourcemaps directly to Sentry via our API. You can improve the consistency & reliability of human readable stacktraces in your project. Exposing sensitive URLs is generally not ideal.",
            "deps":{"sdk":['javascript'],"issue":['artifacts.sourcemaps.none']},
            "priority":10
        },
        {
            "body":"Our tracing product allows you to identify bottlenecks & correlate errors directly in the Senty UI. You have some projects that might be good candidates for this.",
            "deps":{"sdk":['frontend','backend'],"issue":['quota.txn.base']},
            "priority":10
        },
        {
            "body":"Dashboards combine all sentry events into one consistent view for your team. Consider centralizing new crashes, owned issues, and trace/performance metrics that are important.",
            "deps":{"sdk":['mobile'],"issue":['dashboard.none']},
            "priority":10
        },
        {
            "body":"Issues are best owned within Sentry. Assigning issues routes notifications and issues directly to those most apt to fix them. You can even have Sentry do this automatically for you.",
            "deps":{"issue":['assignment.none']},
            "priority":10
        },
        
    ]

    exports.RULES = RULES