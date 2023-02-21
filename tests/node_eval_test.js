import { Engine,EngineOptions } from "../engine.js";
import { mockAccount } from "../engine.js";
let e = new Engine(EngineOptions);
let o = e.process(mockAccount);
console.log(o);

//assert subset matches mock account
