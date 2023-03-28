
```
//chrome-extension.js

const {RULE_ENGINE} = import('./engine.js');

let accountInfo = await fetchInfo(//stuff);

let outReach = RULE_ENGINE.generateOutboundForAccount(accountInfo);

```
