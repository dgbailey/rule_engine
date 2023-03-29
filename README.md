
```
//chrome-extension.js

import {RULE_ENGINE} from('./engine.js');

let accountInfo = await fetchInfo(//stuff);

let outReach = RULE_ENGINE.generateOutboundForAccount(accountInfo);

```
