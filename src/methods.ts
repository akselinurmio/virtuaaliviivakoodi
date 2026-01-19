/**
 * Methods and helpers for generating Virtuaaliviivakoodi
 * @module virtuaaliviivakoodi/methods
 */

const versionNational = 4
const versionInternational = 5

export interface DueDateObject {
  day: number
  month: number
  year: number
}

function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function toYYMMDD(year: number, month: number, day: number): string {
  if (!isValidDate(year, month, day)) {
    throw new Error('Due date is not a valid calendar date')
  }
  return `${pad(year % 100, 2)}${pad(month, 2)}${pad(day, 2)}`
}

/**
 * Converts a due date to YYMMDD format.
 * Accepts string in YYMMDD format, string in ISO 8601 format (YYYY-MM-DD),
 * or object with day, month, year properties.
 */
export function convertDueDate(due: string | DueDateObject): string {
  if (typeof due === 'string') {
    const yymmddMatch = due.match(/^(\d{2})(\d{2})(\d{2})$/)
    if (yymmddMatch) {
      const [, yy, mm, dd] = yymmddMatch
      toYYMMDD(2000 + parseInt(yy, 10), parseInt(mm, 10), parseInt(dd, 10))
      return due
    }

    const isoMatch = due.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      const [, yyyy, mm, dd] = isoMatch
      return toYYMMDD(parseInt(yyyy, 10), parseInt(mm, 10), parseInt(dd, 10))
    }

    throw new Error(
      'Due date string must be in YYMMDD or YYYY-MM-DD (ISO 8601) format',
    )
  }

  if (typeof due === 'object' && due !== null) {
    const { day, month, year } = due

    if (
      typeof day !== 'number' ||
      typeof month !== 'number' ||
      typeof year !== 'number'
    ) {
      throw new Error(
        'Due date object must have numeric day, month, and year properties',
      )
    }

    if (
      !Number.isInteger(day) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year)
    ) {
      throw new Error('Due date object properties must be integers')
    }

    return toYYMMDD(year, month, day)
  }

  throw new Error('Due date must be a string or an object')
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
