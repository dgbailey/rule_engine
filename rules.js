
// Rule {
//     /**
//      * {string} body The outbound text
//      * {Object} deps The DEPENDENCY_TYPES of the outbound)
//      * {int} priority The integer priority 0 ... 10
//      */
// }
const RULES = [
        {
            
            "body":"I'm an ios specific issue related to specifying environments",
            "deps":{"sdk":["ios"],"issue":["release_health.environment.none"]},
            "priority":10
        },
        {
            "body":"I'm a mobile specific issue related to not having ownership.",
            "deps":{"sdk":["mobile"],"issue":["ownership.none"]},
            "priority":10
        },
        {
            "body":"I'm a mobile account that isn't leveraging session based alerting.",
            "deps":{"sdk":["mobile"],"issue":["alerts.metric.none"]},
            "priority":10
        }
        ,
        {
            "body":"I'm a mobile account that isn't leveraging velocity based issue alerting, or regressions, or for fresh issues from the most recent release.",
            "deps":{"sdk":["mobile"],"issue":["alerts.issue.none"]},
            "priority":10
        },
        {
            "body":"I'm a mobile account that isn't leveraging ownership or a VCS integration for suspect commits. These tools can improve the triage process.",
            "deps":{"sdk":["mobile"],"issue":["ownership.none","integrations.vcs.none"]},
            "priority":10
        },
        {
            "body":"I'm an account with JS that isn't uploading sourcemaps. There are benefits to doing so.",
            "deps":{"sdk":['javascript'],"issue":['artifacts.sourcemaps.none']},
            "priority":10
        },
        {
            "body":"I'm an account with both FE & BE sdks with the base number of txns. Am I interested in seeing more data for connecting services?",
            "deps":{"sdk":['frontend','backend'],"issue":['quota.txn.base']},
            "priority":10
        }
    ]

    exports.RULES = RULES