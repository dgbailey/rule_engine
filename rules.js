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
        }
        
    ]

    exports.RULES = RULES