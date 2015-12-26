# prot

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A ridiculously opinionated dev environment for insanely fast rapid prototyping.

**This is a proof-of-concept** and a response to @Vjeux's challenge to create a system for [rapid prototyping](https://twitter.com/mattdesl/status/680776941960564736).

For a more flexible workflow with minimal boilerplate, check out my post [Rapid Prototyping in JavaScript](http://mattdesl.svbtle.com/rapid-prototyping).

## Install

Make sure you have npm@2 or higher, and install globally:

```sh
npm install -g prot
```

## Development

Create a folder and `cd` into it, then run `prot`.

```sh
mkdir cool-prototype
cd cool-prototype
prot index.js --open
```

This will create an empty `index.js` file in the current folder, stub `package.json` (if it doesn't exist), run a server at `localhost:9966`, and launch the URL in your default browser.

Now you can hack around with `index.js`. Try adding the following:

```js
import { parse } from 'url'
console.log(parse(window.location.href))
```

Saving the `index.js` file will trigger a LiveReload. It includes ES2015 and `babel-polyfill` by default, and supports npm/Node dependencies through browserify.

If you don't specify anything, it will default to `index.js`:

```sh
prot
```

## CSS

You can specify an optional CSS file like so:

```sh
prot index.js --css main.css
```

The CSS will be LiveReloaded without refreshing the browser, and without losing any application state.

## Auto-Install

<sup>(this feature is still experimental)</sup>

You can pass `--install` or `-i`, which will auto-install npm dependencies on file save, and add them to your package.json. This means you can hack without typing `npm install`.

```sh
prot --install
```

Also see:

- [atom-npm-install](https://github.com/hughsk/atom-npm-install)

## React/JSX

You can also enable `babel-preset-react` with `-r` or `--react`:

```sh
prot --install --react
```

After running the above command, try pasting the following and reloading the browser.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.body
)
```

## Build

At some point you will want to deliver this through DropBox, FTP, gh-pages, or whatever. The easiest way to do that is by bundling it as a single HTML file.

Use the same arguments as before, but include the `--build` or `-b` flag.

```sh
prot -b index.html
```

The above command will bundle a compressed `index.js` into a script tag inside `index.html`. The HTML is now self-contained. If `--css` is specified, it will be compressed and inlined into a style tag.

The build will set NODE_ENV to `'production'` for smaller bundles.

See here for an example of the build output:

- http://mattdesl.github.io/prot/example/

## Features

- All the features of [budo](https://www.npmjs.com/package/budo) like:
  - Syntax errors shown in browser
  - LiveReload (JS = page refresh, CSS = injected)
  - Pretty terminal logging
- ES2015 and `babel-polyfill` by default, react with a flag
- Builds and compresses JS and CSS as an inline HTML file
- Auto-install npm dependencies
- Auto-stub `index.js` and `package.json`
- Includes `loose-envify`, `uglifyify` and `bundle-collapser` for smaller builds and dead code elimination

## Open Questions

- How do you deal with dependencies without having to set up a `package.json` and all that jazz?
- How do you deal with special Babel presets, source transforms, etc?
- How about CSS pre-processors?
- Is it possible to distribute/share a hack without compressing/bundling the code?

## See Also

- [Rapid Prototyping in JavaScript](http://mattdesl.svbtle.com/rapid-prototyping)
- [budo](https://github.com/mattdesl/budo) - a more robust dev server, similar to this
- [module-generator](https://www.npmjs.com/package/module-generator) for the boilerplate (ignores, license)
- [ghrepo](http://npmjs.com/package/ghrepo) for the GitHub API
- [@mattdesl/ghpages](npmjs.com/package/@mattdesl/ghpages) for distribution


## License

MIT, see [LICENSE.md](http://github.com/mattdesl/prot/blob/master/LICENSE.md) for details.
