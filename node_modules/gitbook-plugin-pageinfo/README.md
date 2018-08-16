# gitbook-plugin-pageinfo

[![npm version](https://badge.fury.io/js/gitbook-plugin-pageinfo.svg)](https://badge.fury.io/js/gitbook-plugin-pageinfo)

This is a Gitbook plugin to show the title and description on every page.

## Demo

![Image Demo](/demo.png)

## How to install

Add `pageinfo` to your Gitbook plugins list:

```js
{
  "plugins": ["pageinfo"]
}

```

After that, run `gitbook install` to download and install the plugin.

## Disable on specific page

To disable this display on a specific page, add `pageinfo: false` to the metadata of the page.
