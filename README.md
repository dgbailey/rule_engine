
```
//chrome-extension.js

const {RULE_ENGINE} = require('./engine.js');

let accountInfo = await fetchInfo(//stuff);

let outReach = RULE_ENGINE.process(accountInfo);

```
