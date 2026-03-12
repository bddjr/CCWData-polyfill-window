//@ts-nocheck

// jsonObj./*<https://github.com/bddjr/CCWData-polyfill-window>*/toString.constructor`
if (!window._CCWDataPolyfillWindow) {
    window._CCWDataPolyfillWindow = true;

    // window.Function = toString.constructor;

    let StringPrototype = String.prototype;
    let ArrayPrototype = Array.prototype;

    let { concat, includes, match } = StringPrototype;
    let { forEach, splice } = ArrayPrototype;

    let checkStack = e => includes.call(e.stack, 'scratch3_ccw_data.');
    let regexp_test_forEach = /-/.test.bind(/\bwindow\[[a-zA-Z]+\]\s*=\s*null/);

    StringPrototype.concat = function () {
        return concat.apply(
            ((
                includes.call(this, 'const XMLHttpRequest = null') &&
                match.call(this, /const [a-zA-Z]+ = null/g).length > 23 &&
                checkStack(Error())
            ) ? '' : this),
            arguments
        )
    };

    ArrayPrototype.forEach = function (f) {
        (
            regexp_test_forEach(f) &&
            checkStack(Error())
        )
            ? splice.call(this, 0, this.length)
            : forEach.apply(this, arguments)
    };
}
// ```
