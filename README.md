# eslint-lockdown

generate an `.eslintrc` against a legacy codebase

### usage

```
$ npm i -g eslint-lockdown
$ eslint-lockdown .
```

`eslint-lockdown` will generate an `.eslintrc` to utilize `eslint` against a legacy codebase. It reads in your (optional) current `.eslintrc` file and generates a new `.eslintrc` with failing rules marked as `warn` which the codebase violates. This allows you to "put a stake in the ground" to prevent the codebase from getting worse. Over time, you can fix the codebase and remove

To over-write your current `.eslintrc`:

```
$ eslint-lockdown . >> .eslintrc
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
