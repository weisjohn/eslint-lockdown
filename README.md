# eslint-lockdown

generate an `.eslintrc` against a legacy codebase

### usage

```
$ npm i -g eslint-lockdown
$ eslint-lockdown
```

`eslint-lockdown` will generate an `.eslintrc` to utilize `eslint` against a legacy codebase. It reads in your (optional) current `.eslintrc` file and generates a new `.eslintrc` with failing rules marked as `warn` which the codebase violates. This allows you to "put a stake in the ground" to prevent the codebase from getting worse, utilizing `eslint` as part of your build process without halting development until you have time to refactor.

By default, `eslint-lockdown` will overwrite the `.eslintrc` file. To preview the results without overwriting:

```
$ eslint-lockdown --debug
```

### library

If you want to further wrangle the configuration, you can use `eslint-lockdown` as a node library:

```
var lockdown = require('eslint-lockdown');

lockdown(__dirname, function(err, config) {
    if (err) return console.error(err);
    console.log(config);
});
```

### example

This snippet, `foo.js`:

```javascript
module.exports = function() {
    var unused = true;
    console.log("foobar");
}
```

violates many `eslint:recommended` rules:

```bash
$ eslint foo.js

/foo/bar/foo.js
  1:1  error  "module" is not defined             no-undef
  2:9  error  "unused" is defined but never used  no-unused-vars
  3:5  error  Unexpected console statement        no-console
  3:5  error  "console" is not defined            no-undef

✖ 4 problems (4 errors, 0 warnings)
```

Running `eslint-lockdown`, we would generate an `.eslintrc` file to make `eslint` pass:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-undef": [
            1
        ],
        "no-unused-vars": [
            1
        ],
        "no-console": [
            1
        ]
    }
}
```

After generating the new file, `eslint` will pass with warnings:

```bash
$ eslint .

/Users/john/mysrc/weisjohn/scratch/eslint_lockdown/index.js
  1:1  warning  "module" is not defined             no-undef
  2:9  warning  "unused" is defined but never used  no-unused-vars
  3:5  warning  Unexpected console statement        no-console
  3:5  warning  "console" is not defined            no-undef

✖ 4 problems (0 errors, 4 warnings)
```
