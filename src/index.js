/** @module virtuaaliviivakoodi */

const methods = require('./methods')

/**
 * Returns Virtuaaliviivakoodi as a string.
 * Use only cents OR amount, not both.
 * @param {Object} options - Information that will be included.
 * @param {String} options.iban - IBAN formed account number
 * @param {Number|String} options.reference - Reference number in either international or national form
 * @param {Number} [options.cents] - Amount in cents (1€ = 100c) with maximum of 99999999
 * @param {Number} [options.amount] - Deprecated: Amount in euros with maximum of 999999.99
 * @param {String} [options.due] - Due date in form of "vvkkpp" where vv is year, kk is month and pp is day
 * @returns {String} Virtuaaliviivakoodi
 */
module.exports = function Virtuaaliviivakoodi(options) {
  // Check that "given" parameter is an object
  if (typeof options !== 'object') {
    throw new Error('Object must be given as parameter')
  }

  const formatted = {}

  // IBAN must be given
  if (options.iban) {
    formatted.iban = methods.convertIBAN(options.iban)
  } else {
    throw new Error('No IBAN specified')
  }

  // Reference must be given
  if (options.reference) {
    formatted.reference = methods.convertReference(options.reference)
    formatted.version = methods.referenceToVersion(options.reference)
  } else {
    throw new Error('No reference specified')
  }

  if ('amount' in options) {
    throw new Error(
      'options.amount is unsupported since v2. Use options.cents instead.'
    )
  }

  if (options.cents) {
    formatted.amount = methods.convertAmountOfCents(options.cents)
  } else {
    formatted.amount = methods.pad('', 8)
  }

  if (options.due) {
    formatted.due = methods.checkDue(options.due)
  } else {
    formatted.due = methods.pad('', 6)
  }

  return (
    formatted.version +
    formatted.iban +
    formatted.amount +
    formatted.reference +
    formatted.due
  )
}
