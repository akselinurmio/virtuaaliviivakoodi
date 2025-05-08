/**
 * Methods and helpers for generating Virtuaaliviivakoodi
 * @module virtuaaliviivakoodi/methods
 */

const versionNational = 4
const versionInternational = 5

/**
 * Check that given due date is of proper length and return only valid string.
 * Due date needs to be exactly 6 characters long string consisting of digits.
 */
export function checkDue(due: string): string {
  const pattern = /^\d{6}$/

  if (typeof due !== 'string') {
    throw new Error('Due date is not a string')
  }
  if (!pattern.test(due)) {
    throw new Error('Due date is not valid')
  }

  return due
}

/**
 * Strips non-alpha-numerical characters off from IBAN
 */
export function convertIBANToElectronicIBAN(iban: string): string {
  return iban.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * Convert IBAN account number to suitable format.
 */
export function convertIBAN(iban: string): string {
  if (typeof iban !== 'string') {
    throw new Error('IBAN value is not a string')
  }

  const electronicIban = convertIBANToElectronicIBAN(iban)

  if (!/^FI\d{16}$/.test(electronicIban)) {
    throw new Error('Given IBAN must be Finnish IBAN')
  }

  return electronicIban.substring(2)
}

/**
 * Convert reference number to sufficiently padded format.
 * Defines reference's type automatically.
 */
export function convertReference(reference: number | string): string {
  if (!['string', 'number'].includes(typeof reference)) {
    throw new Error('Given reference is neither number or string')
  }

  reference = String(reference).replace(/\s/g, '')

  const version = referenceToVersion(reference)

  if (version === versionInternational) {
    reference = reference.substring(2, 4) + pad(reference.substring(4), 21)
  }

  return pad(reference, 23)
}

/**
 * Determine Virtuaaliviivakoodi's version by given reference number.
 * Return values are 5 = international reference and 4 = national type.
 */
export function referenceToVersion(reference: number | string): 4 | 5 {
  if (!['string', 'number'].includes(typeof reference)) {
    throw new Error('Given reference is neither number or string')
  }

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
}

/**
 * Converts given amount of cents to 8 characters long string.
 * The amount can't be negative or bigger than 99999999.
 */
export function convertAmountOfCents(cents: number): string {
  if (typeof cents !== 'number' || isNaN(cents)) {
    throw new Error('Given argument is not a number')
  }

  if (cents < 0) {
    throw new Error('Given amount is negative')
  }

  if (cents > 99999999) {
    throw new Error('Given amount is too large')
  }

  if (!Number.isInteger(cents)) {
    throw new Error('Given amount is not an integer')
  }

  return pad(cents, 8)
}

/**
 * Pads values to fixed width with zero.
 */
export function pad(value: string | number, width: number): string {
  if (!['string', 'number'].includes(typeof value)) {
    throw new Error('Value must be a string or a number')
  }
  if (typeof width !== 'number') {
    throw new Error('Width must be a number')
  }

  if (typeof value !== 'string') value = String(value)

  if (value.length > width)
    throw new Error(
      `Value is ${value.length} characters long, maximum being ${width}`,
    )

  return value.padStart(width, '0')
}
