---
sidebar: auto
---

# Local Development

## Information

If you here you may be interested in improving core MdPress.

MdPress is using a combo with [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna).

## Init packages

```bash
 yarn // it will install dependencies of all packages
```

`yarn` will use hoisting. What does it mean for you ?

It will regroup all dependencies in the workspace root and link all packages.

Check the link by running the following command:

```bash
    ls -la node_modules/@mdpress
```

:::warning
You have to take care to declare all dependencies inside subFolders package.json. When publish the lib if dependencies from a package is not declare it will just not work.
:::

:::warning
There is a special package you should have a look is @mdpress/shared-utils that are in typescript.
:::

After install everything it will run `yarn tsc`. This command will tell to @mdpress/shared-utils workspace to compile his js.

:::warning
From here if you are making change inside this package you will have to
run `yarn tsc` all the time or run in separate shell `yarn run tsc -w`. This will re run tsc at any change from shared-utils
:::

## Link

Good from here you have everything ready. You need to link MdPress to your project.

```bash
yarn register-mdpress
```

You will have something like this: `success Registered "mdpress".`

It will link the package MdPress from `packages/mdpress`. You will have access to MdPress cli and packages.

They are declared in the `packages/mdpress/package.json`

```js
{
"main": "index.js",
///
"bin": {
    "mdpress": "cli.js"
  }
  ///
}
```

Now go to your project and run `yarn link mdpress`.

You should have it `success Using linked package for "mdpress".`

## Unlink

You may want to unlink everything. For it in the workspace root folder. Run

```bash
yarn unregister-mdpress
```

Now you can run `yarn unlink mdpress` into your project folder.

If everything work properly you should have an error telling you there is no package found called mdpress, if you run `yarn link mdpress` in you project folder.

## BUGS / QA

You will maybe find some difficulty with link. If you encounter something like `There's already a package called "mdpress" registered`.
You already have MdPress registered:

- If you already link MdPress from [Link](#link). It’s totally fine. If you make changes because it is symlink you dont have to re run something. You will have to rerun yarn tsc if you update shared-utils package. Nothing more
- If you didn’t do anything. You already have MdPress linked somewhere. What you have to do is deleting folder where you ran `yarn link` or `yarn unlink`.

## More

You will have interesting commands available:

- `yarn packages:list` will list you every packages present and their versions [More...](https://github.com/lerna/lerna/tree/master/commands/list#readme)
- `yarn packages:changed` will tell you which package will be affect by the next lerna publish / version [More...](https://github.com/lerna/lerna/tree/master/commands/changed#readme)
- `yarn packages:diff` will show you all diff from last release [More...](https://github.com/lerna/lerna/tree/master/commands/diff#readme)
