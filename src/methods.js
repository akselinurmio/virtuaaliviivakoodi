/**
 * Methods and helpers for generating Virtuaaliviivakoodi
 * @module virtuaaliviivakoodi/methods
 */

const ibanTool = require('iban')

// Different versions of Virtuaaliviivakoodi
const versionNational = 4
const versionInternational = 5

module.exports = {
  /**
   * Check that given due date is of proper length and return only valid string.
   * Due date needs to be exactly 6 characters long string consisting of digits.
   * @param {String} due
   * @returns {String}
   */
  checkDue: function checkDue(due) {
    const pattern = /^[0-9]{6}$/

    if (typeof due !== 'string') {
      throw new Error('Due date is not a string')
    }
    if (!pattern.test(due)) {
      throw new Error('Due date is not valid')
    }

    return due
  },

  /**
   * Convert IBAN account number to suitable format.
   * @param {String} iban
   * @returns {String} Converted IBAN
   */
  convertIBAN: function convertIBAN(iban) {
    const pattern = /^FI/

    if (typeof iban !== 'string') {
      throw new Error('IBAN value is not a string')
    }

    if (!ibanTool.isValid(iban)) {
      throw new Error('Given IBAN is not valid')
    }
    if (!pattern.test(iban)) {
      throw new Error('Given IBAN is not Finnish')
    }

    // Return electronic format IBAN with country code removed
    return ibanTool.electronicFormat(iban).substring(2)
  },

  /**
   * Convert reference number to sufficiently padded format.
   * Defines reference's type automatically.
   * @param {Number|String} reference
   * @returns {String} Converted reference number
   */
  convertReference: function convertReference(reference) {
    if (!/^(string|number)$/.test(typeof reference)) {
      throw new Error('Given reference is neither number or string')
    }

    // Convert the reference number to string and remove any whitespace
    reference = String(reference).replace(/\s/g, '')

    // Determine how to pad the reference from the version
    const version = this.referenceToVersion(reference)

    // In case of international reference we pad everything after checksum
    if (version === versionInternational) {
      reference =
        reference.substring(2, 4) + this.pad(reference.substring(4), 21)
    }

    return this.pad(reference, 23)
  },

  /**
   * Determine Virtuaaliviivakoodi's version by given reference number.
   * Return values are 5 = international reference and 4 = national type.
   * @param {Number|String} reference - Reference number
   * @returns {Number} The version
   */
  referenceToVersion: function referenceToVersion(reference) {
    if (!['string', 'number'].includes(typeof reference)) {
      throw new Error('Given reference is neither number or string')
    }

    // Convert the reference number to string and remove any whitespace
    const referenceString = String(reference).replace(/\s/g, '')

    const internationalPattern = /^RF[0-9]{3,23}$/
    const nationalPattern = /^[0-9]{4,20}$/

    if (internationalPattern.test(referenceString)) {
      return versionInternational
    }
    if (nationalPattern.test(referenceString)) {
      return versionNational
    }
    throw new Error('Given reference is not valid')
  },

  /**
   * Converts given amount to 8 characters long string.
   * The amount can't be negative or bigger than 999999.99.
   * @deprecated Replaced by {@link convertAmountOfCents}
   * @param {Number} amount
   * @returns {String} Padded amount string
   */
  convertAmount: function convertAmount(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Given amount is not valid')
    }

    // Check if the given amount is negative and throw an exception if it is
    if (amount < 0) {
      throw new Error('Given amount is negative')
    }

    // Check if the given amount is too big and throw an exception if it is
    if (amount > 999999.99) {
      throw new Error('Given amount is too big')
    }

    // Check that the amount has two or less decimals
    const decimals = this.countDecimals(amount)
    if (decimals > 2) {
      throw new Error("There can't be more than two decimals in the amount")
    }

    // Turn the given amount into array of euros and cents
    const amountArray = amount.toFixed(2).split('.')

    // Return string of padded euros and cents
    return this.pad(amountArray[0], 6) + amountArray[1]
  },

  /**
   * Converts given amount of cents to 8 characters long string.
   * The amount can't be negative or bigger than 99999999.
   * @param {Number} cents
   * @returns {String} Padded amount string
   */
  convertAmountOfCents: function convertAmountOfCents(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) {
      throw new Error('Given argument is not a number')
    }

    // Throw if the amount of cents is negative
    if (cents < 0) {
      throw new Error('Given amount is negative')
    }

    // Throw if the amount of cents is too large
    if (cents > 99999999) {
      throw new Error('Given amount is too large')
    }

    // Check that cents is an integer
    const isInteger = this.countDecimals(cents) === 0
    if (!isInteger) {
      throw new Error('Given amount is not an integer')
    }

    // Return string of padded cents
    return this.pad(cents, 8)
  },

  /**
   * Counts number of decimals
   * @param {Number} number
   * @returns {Number} Number of decimals
   */
  countDecimals: function countDecimals(num) {
    // Check that the argument is a number
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('Given parameter is not a number')
    }

    if (Math.floor(num) === num) return 0
    return String(num).split('.')[1].length
  },

  /**
   * Pads values to fixed width with zero.
   * @param {String|Number} value
   * @param {Number} width
   * @returns {String}
   */
  pad: function pad(value, width) {
    // Do type checks and throw an error if needed
    if (!['string', 'number'].includes(typeof value)) {
      throw new Error('Value must be a string or a number')
    }
    if (typeof width !== 'number') {
      throw new Error('Width must be a number')
    }

    // If the given value is not a string, make it one
    if (typeof value !== 'string') value = String(value)

    if (value.length > width)
      throw new Error(
        `Value is ${value.length} characters long, maximum being ${width}`
      )

    return new Array(width - value.length + 1).join('0') + value
  }
}
