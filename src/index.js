/** @module virtuaaliviivakoodi */

import {
  convertIBAN,
  convertReference,
  referenceToVersion,
  convertAmountOfCents,
  checkDue,
  pad,
} from './methods.js'

/**
 * Returns Virtuaaliviivakoodi as a string.
 * Use only cents OR amount, not both.
 * @param {Object} options - Information that will be included.
 * @param {String} options.iban - IBAN formed account number
 * @param {Number|String} options.reference - Reference number in either international or national form
 * @param {Number} [options.cents] - Amount in cents (1€ = 100c) with maximum of 99999999
 * @param {String} [options.due] - Due date in form of "vvkkpp" where vv is year, kk is month and pp is day
 * @returns {String} Virtuaaliviivakoodi
 */
function Virtuaaliviivakoodi(options) {
  // Check that "given" parameter is an object
  if (typeof options !== 'object') {
    throw new Error('Object must be given as parameter')
  }

  const formatted = {}

  // IBAN must be given
  if (options.iban) {
    formatted.iban = convertIBAN(options.iban)
  } else {
    throw new Error('No IBAN specified')
  }

  // Reference must be given
  if (options.reference) {
    formatted.reference = convertReference(options.reference)
    formatted.version = referenceToVersion(options.reference)
  } else {
    throw new Error('No reference specified')
  }

  if ('amount' in options) {
    throw new Error(
      'options.amount is unsupported since v2. Use options.cents instead.',
    )
  }

  if (options.cents) {
    formatted.amount = convertAmountOfCents(options.cents)
  } else {
    formatted.amount = pad('', 8)
  }

  if (options.due) {
    formatted.due = checkDue(options.due)
  } else {
    formatted.due = pad('', 6)
  }

  return (
    formatted.version +
    formatted.iban +
    formatted.amount +
    formatted.reference +
    formatted.due
  )
}

export default Virtuaaliviivakoodi
