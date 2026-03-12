干掉 “Gandi云数据” 扩展的全局变量污染。

原理：劫持 `String.prototype.concat` 和 `Array.prototype.forEach` 。

关于全局变量污染，可参考 “Gandi云数据” 扩展的以下代码：

```js
function p(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        , r = ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "Worker", "alert", "confirm", "prompt", "setTimeout", "setInterval", "Function", "Image", "Audio", "Video", "open"]
        , n = {}
        , o = window.Function;
    r.forEach((function(t) {
        n[t] = window[t],
        window[t] = null
    }
    ));
    try {
        var c = Object.keys(e)
            , i = Object.values(e)
            , s = '\n      "use strict";\n      const globalThis = null;\n      const window = null;\n      const document = null;\n      const alert = null;\n      const confirm = null;\n      const prompt = null;\n      const fetch = null;\n      const XMLHttpRequest = null;\n      const localStorage = null;\n      const sessionStorage = null;\n      const Image = null;\n      const Audio = null;\n      const Video = null;\n      const Worker = null;\n      const Function = null;\n      const open = null;\n      const history = null;\n      const location = null;\n      const navigator = null;\n      const global = null;\n      const self = null;\n      const top = null;\n      const parent = null;\n      const console = null;\n      '.concat(t)
            , u = a(o, c.concat([s]));
        return u.apply(void 0, i)
    } finally {
        r.forEach((function(t) {
            window[t] = n[t]
        }
        ))
    }
}
```
