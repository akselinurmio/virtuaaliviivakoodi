/** @module virtuaaliviivakoodi */

import {
  convertAmountOfCents,
  convertDueDate,
  convertIBAN,
  convertReference,
  pad,
  referenceToVersion,
  type DueDateObject,
} from './methods.js'

interface VirtuaaliviivakoodiOptions {
  /** IBAN account number */
  iban: string
  /** The reference number */
  reference: number | string
  /** The amount in cents (optional) */
  cents?: number
  /** The due date (optional) - YYMMDD string, YYYY-MM-DD ISO 8601 string, or object with day, month, year (January = 1) */
  due?: string | DueDateObject
}

export default function Virtuaaliviivakoodi(
  options: VirtuaaliviivakoodiOptions,
): string {
  if (typeof options !== 'object') {
    throw new Error('Object must be given as parameter')
  }

  let result = ''

  if (!options.reference) {
    throw new Error('No reference specified')
  }
  result += referenceToVersion(options.reference).toString()

  if (!options.iban) {
    throw new Error('No IBAN specified')
  }
  result += convertIBAN(options.iban)

  if ('amount' in options) {
    throw new Error(
      'options.amount is unsupported since v2. Use options.cents instead.',
    )
  }

  if (options.cents) {
    result += convertAmountOfCents(options.cents)
  } else {
    result += pad('', 8)
  }

  result += convertReference(options.reference)

  if (options.due) {
    result += convertDueDate(options.due)
  } else {
    result += pad('', 6)
  }

  return result
}
