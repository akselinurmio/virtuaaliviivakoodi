[![npm](https://img.shields.io/npm/v/virtuaaliviivakoodi.svg)](https://www.npmjs.com/package/virtuaaliviivakoodi)
[![Travis](https://img.shields.io/travis/akselinurmio/virtuaaliviivakoodi.svg)](https://travis-ci.org/akselinurmio/virtuaaliviivakoodi)
[![Coveralls](https://img.shields.io/coveralls/akselinurmio/virtuaaliviivakoodi.svg)](https://coveralls.io/github/akselinurmio/virtuaaliviivakoodi)
[![David](https://img.shields.io/david/akselinurmio/virtuaaliviivakoodi.svg)](https://david-dm.org/akselinurmio/virtuaaliviivakoodi)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/akselinurmio/virtuaaliviivakoodi/master/LICENSE)

*Virtuaaliviivakoodi* is clear text implementation of [The Federation of Finnish Financial Services](http://www.finanssiala.fi/en)' Pankkiviivakoodi ("Finnish bank transfer barcode"). Pankkiviivakoodi's specification can be found on [their website](http://www.finanssiala.fi/maksujenvalitys/dokumentit/Pankkiviivakoodi-opas.pdf "Pankkiviivakoodi-opas").

This program creates Virtuaaliviivakoodi with given parameters. It supports both current versions of Pankkiviivakoodi, version 4 (reference number in national form) and version 5 (reference number in international form, aka Creditor Reference based on ISO 11649).

## Usage

First [install](https://docs.npmjs.com/getting-started/installing-npm-packages-locally "Installing npm packages locally") virtuaaliviivakoodi package from npm in your project.

```sh
npm install virtuaaliviivakoodi
```

After installing the package you can use it in your code. This module returns one simple function when required.

Function accepts one parameter: an **object** containing information to be included in Virtuaaliviivakoodi. Following parameters are understood:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `iban` | String | | IBAN formed account number |
| `reference` | Number or String | | Reference number in either international or national form |
| `amount` | Number | optional | Amount of maximum of 999999.99 in euros |
| `due` | String | optional | Due date in form of "vvkkpp" where vv is year, kk is month and pp is day |

Function returns a string containing the Virtuaaliviivakoodi.

### Examples

#### Version 4

```javascript
const virtuaaliviivakoodi = require("virtuaaliviivakoodi")

const options = {
  iban: "FI37 1590 3000 0007 76",
  reference: 11112,
  amount: 12.25,
  due: "161221"
}

virtuaaliviivakoodi(options)
// => "437159030000007760000122500000000000000000011112161221"
```

#### Version 5

```javascript
const virtuaaliviivakoodi = require("virtuaaliviivakoodi")

const options = {
  iban: "FI37 1590 3000 0007 76",
  reference: "RF9811112", // Creditor Reference, ISO 11649
  amount: 1.10,
  due: "170101"
}

virtuaaliviivakoodi(options)
// => "537159030000007760000011098000000000000000011112170101"
```
