/** @module virtuaaliviivakoodi */

import {
  convertIBAN,
  convertReference,
  referenceToVersion,
  convertAmountOfCents,
  checkDue,
  pad,
} from './methods.js'

interface VirtuaaliviivakoodiOptions {
  /** IBAN account number */
  iban: string
  /** The reference number */
  reference: number | string
  /** The amount in cents */
  cents?: number
  /** The due date (optional) */
  due?: string
}

export default function Virtuaaliviivakoodi(
  options: VirtuaaliviivakoodiOptions,
): string {
  if (typeof options !== 'object') {
    throw new Error('Object must be given as parameter')
  }

  const formatted: Record<string, string> = {}

  if (options.iban) {
    formatted.iban = convertIBAN(options.iban)
  } else {
    throw new Error('No IBAN specified')
  }

  if (options.reference) {
    formatted.reference = convertReference(options.reference)
    formatted.version = referenceToVersion(options.reference).toString()
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
