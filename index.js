/** @module virtuaaliviivakoodi */

const methods = require('./methods')

/**
 * Returns Virtuaaliviivakoodi as a string.
 * @param {Object} given - Information that will be included.
 * @param {String} given.iban - IBAN formed account number
 * @param {Number|String} given.reference - Reference number in either international or national form
 * @param {Number} [given.amount] - Amount in euros with maximum of 999999.99 and minimum of 0.01
 * @param {String} [given.due] - Due date in form of "vvkkpp" where vv is year, kk is month and pp is day
 * @returns {String} Virtuaaliviivakoodi
 */
module.exports = function Virtuaaliviivakoodi(given) {
  // Check that "given" parameter is an object
  if (typeof given !== 'object')
    throw new Error('Object must be given as parameter')

  const content = {}

  // IBAN must be given
  if ('iban' in given) content.iban = methods.convertIBAN(given.iban)
  else throw new Error('No IBAN specified')

  // Reference must be given
  if ('reference' in given)
    content.reference = methods.convertReference(given.reference)
  else throw new Error('No reference specified')

  content.version = methods.referenceToVersion(content.reference)

  if ('amount' in given) content.amount = methods.convertAmount(given.amount)
  else content.amount = methods.pad('', 8)

  if ('due' in given) content.due = methods.checkDue(given.due)
  else content.due = methods.pad('', 6)

  return (
    content.version +
    content.iban +
    content.amount +
    methods.pad(content.reference, 23) +
    content.due
  )
}
