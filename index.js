/** @module virtuaaliviivakoodi */

const methods = require('./methods')

/**
 * Returns Virtuaaliviivakoodi as a string.
 * @param {Object} options - Information that will be included.
 * @param {String} options.iban - IBAN formed account number
 * @param {Number|String} options.reference - Reference number in either international or national form
 * @param {Number} [options.amount] - Amount in euros with maximum of 999999.99 and minimum of 0.01
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
  if ('iban' in options) {
    formatted.iban = methods.convertIBAN(options.iban)
  } else {
    throw new Error('No IBAN specified')
  }

  // Reference must be given
  if ('reference' in options) {
    formatted.reference = methods.convertReference(options.reference)
    formatted.version = methods.referenceToVersion(options.reference)
  } else {
    throw new Error('No reference specified')
  }

  if ('amount' in options) {
    formatted.amount = methods.convertAmount(options.amount)
  } else {
    formatted.amount = methods.pad('', 8)
  }

  if ('due' in options) {
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
