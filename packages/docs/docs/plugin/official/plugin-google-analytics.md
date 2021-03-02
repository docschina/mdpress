---
title: google-analytics
metaTitle: Google Analytics Plugin | MdPress
---

# [@mdpress/plugin-google-analytics](https://github.com/docschina/mdpress/tree/master/packages/%40mdpress/plugin-google-analytics)


> Google analytics plugin

## Install

```bash
yarn add -D @mdpress/plugin-google-analytics
# OR npm install -D @mdpress/plugin-google-analytics
```

::: warning
We currently recommend using [Yarn](https://yarnpkg.com/en/) instead of npm to install all dependencies if you are using Google Analytics Plugin, because npm fails to generate the correct dependency tree in this case.
:::

## Usage

```javascript
module.exports = {
  plugins: [
    [
      '@mdpress/google-analytics',
      {
        'ga': '' // UA-00000000-0
      }
    ]
  ]
}
```

::: tip
Please be aware of [GDPR (2018 reform of EU data protection rules)](https://ec.europa.eu/commission/priorities/justice-and-fundamental-rights/data-protection/2018-reform-eu-data-protection-rules_en) as IPs are anonymized automatically.
:::

## Options

### ga

- Type: `string`
- Default: `undefined`

Provide the Google Analytics ID to enable integration.
