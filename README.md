[![npm](https://img.shields.io/npm/v/virtuaaliviivakoodi.svg)](https://www.npmjs.com/package/virtuaaliviivakoodi)
[![Coveralls](https://img.shields.io/coveralls/akselinurmio/virtuaaliviivakoodi.svg)](https://coveralls.io/github/akselinurmio/virtuaaliviivakoodi)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/akselinurmio/virtuaaliviivakoodi/master/LICENSE)

_Virtuaaliviivakoodi_ is clear text implementation of
[The Federation of Finnish Financial Services](https://www.finanssiala.fi/en/)'
Pankkiviivakoodi ("Finnish bank transfer barcode"). Pankkiviivakoodi's
specification can be found on
[their website](https://www.finanssiala.fi/wp-content/uploads/2021/03/Pankkiviivakoodi-opas.pdf "Pankkiviivakoodi-opas")
(in Finnish).

This program creates Virtuaaliviivakoodi with given parameters. It supports both
current versions of Pankkiviivakoodi, version 4 (reference number in national
form) and version 5 (reference number in international form, aka Creditor
Reference based on ISO 11649).

## Supported Node.js versions

The library requires Node.js 20 or higher. It is tested with Node.js 20, 22,
and 24.

## Usage

First
[install](https://docs.npmjs.com/getting-started/installing-npm-packages-locally "Installing npm packages locally")
virtuaaliviivakoodi package from npm in your project.

```sh
npm install virtuaaliviivakoodi
```

After installing the package you can use it in your code. This module exports a
default function.

Function accepts one parameter: an **object** containing information to be
included in Virtuaaliviivakoodi. Following parameters are understood:

| Name        | Type             | Attributes | Description                                                              |
| ----------- | ---------------- | ---------- | ------------------------------------------------------------------------ |
| `iban`      | String           |            | IBAN formed account number                                               |
| `reference` | Number or String |            | Reference number in either international or national form                |
| `cents`     | Number           | optional   | Amount in cents (1€ = 100c) with maximum of 99999999                     |
| `due`       | String           | optional   | Due date in form of "YYMMDD" where YY is year, MM is month and DD is day |

Function returns a string containing the Virtuaaliviivakoodi.

### Examples

#### Version 4 (ESM)

```javascript
import virtuaaliviivakoodi from "virtuaaliviivakoodi";

const options = {
  iban: "FI37 1590 3000 0007 76",
  reference: 11112,
  cents: 1225, // 12.25 euros
  due: "161221",
};

virtuaaliviivakoodi(options);
// => "437159030000007760000122500000000000000000011112161221"
```

#### Version 5 (ESM)

```javascript
import virtuaaliviivakoodi from "virtuaaliviivakoodi";

const options = {
  iban: "FI37 1590 3000 0007 76",
  reference: "RF9811112", // Creditor Reference, ISO 11649
  cents: 110, // 1.10 euros
  due: "170101",
};

virtuaaliviivakoodi(options);
// => "537159030000007760000011098000000000000000011112170101"
```

#### CommonJS

The package also supports CommonJS:

```javascript
const virtuaaliviivakoodi = require("virtuaaliviivakoodi");

const options = {
  iban: "FI37 1590 3000 0007 76",
  reference: 11112,
  cents: 1225,
  due: "161221",
};

virtuaaliviivakoodi(options);
// => "437159030000007760000122500000000000000000011112161221"
```
