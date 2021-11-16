# Git Command Notes
* loop through submodules and find the origin name for the branch we are on. This handles the very rare case where the user is not on origin
```bash
git submodule foreach bash -c 'git branch -vv | sed -En "s/.*\[([^/]*)\/.*/\1/p"'
```

* loop through submodules and find the url for the origin that is being used
```bash
git submodule foreach bash -c 'git branch -vv | sed -En "s/.*\[([^/]*)\/.*/\1/p" | xargs -I{} git remote get-url {}'
```
