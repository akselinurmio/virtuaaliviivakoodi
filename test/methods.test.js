import { describe, test } from 'node:test'
import assert from 'node:assert'
import {
  convertDueDate,
  convertAmountOfCents,
  convertIBAN,
  convertReference,
  pad,
  referenceToVersion,
} from '../src/methods.ts'

describe('convertDueDate', () => {
  test('converts YYMMDD string', () => {
    assert.strictEqual(convertDueDate('160222'), '160222')
  })

  test('converts YYMMDD string at end of month', () => {
    assert.strictEqual(convertDueDate('270131'), '270131')
  })

  test('converts ISO 8601 date string', () => {
    assert.strictEqual(convertDueDate('2027-01-31'), '270131')
  })

  test('converts ISO 8601 date string with single-digit month/day', () => {
    assert.strictEqual(convertDueDate('2026-03-05'), '260305')
  })

  test('converts ISO 8601 date string at end of year', () => {
    assert.strictEqual(convertDueDate('2030-12-31'), '301231')
  })

  test('converts date object', () => {
    assert.strictEqual(
      convertDueDate({ year: 2027, month: 1, day: 31 }),
      '270131',
    )
  })

  test('converts date object with single-digit month/day', () => {
    assert.strictEqual(
      convertDueDate({ year: 2026, month: 3, day: 5 }),
      '260305',
    )
  })

  test('converts date object at end of year', () => {
    assert.strictEqual(
      convertDueDate({ year: 2030, month: 12, day: 31 }),
      '301231',
    )
  })

  test('throws when no argument provided', () => {
    assert.throws(() => convertDueDate(), {
      message: /Due date must be a string or an object/,
    })
  })

  test('throws when due is null', () => {
    assert.throws(() => convertDueDate(null), {
      message: /Due date must be a string or an object/,
    })
  })

  test('throws when due is neither string nor object', () => {
    assert.throws(() => convertDueDate(20270131), {
      message: /Due date must be a string or an object/,
    })
  })

  test('throws for YYMMDD string in wrong format', () => {
    assert.throws(() => convertDueDate('20170920'), {
      message: /Due date string must be in YYMMDD or YYYY-MM-DD/,
    })
  })

  test('throws for invalid YYMMDD calendar date with zero month/day', () => {
    assert.throws(() => convertDueDate('270000'), {
      message: /Due date is not a valid calendar date/,
    })
  })

  test('throws for invalid YYMMDD calendar date with invalid month', () => {
    assert.throws(() => convertDueDate('271301'), {
      message: /Due date is not a valid calendar date/,
    })
  })

  test('throws for invalid YYMMDD calendar date with invalid day', () => {
    assert.throws(() => convertDueDate('270132'), {
      message: /Due date is not a valid calendar date/,
    })
  })

  test('throws for malformed ISO 8601 string', () => {
    assert.throws(() => convertDueDate('2027/01/31'), {
      message: /Due date string must be in YYMMDD or YYYY-MM-DD/,
    })
  })

  test('throws for incomplete ISO 8601 string', () => {
    assert.throws(() => convertDueDate('2027-1-31'), {
      message: /Due date string must be in YYMMDD or YYYY-MM-DD/,
    })
  })

  test('throws for invalid ISO 8601 calendar date', () => {
    assert.throws(() => convertDueDate('2027-02-30'), {
      message: /Due date is not a valid calendar date/,
    })
  })

  test('throws for object with missing property', () => {
    assert.throws(() => convertDueDate({ year: 2027, month: 1 }), {
      message: /Due date object must have numeric day, month, and year/,
    })
  })

  test('throws for object with non-numeric property', () => {
    assert.throws(() => convertDueDate({ year: 2027, month: 1, day: '31' }), {
      message: /Due date object must have numeric day, month, and year/,
    })
  })

  test('throws for object with non-integer values', () => {
    assert.throws(() => convertDueDate({ year: 2027, month: 1.5, day: 31 }), {
      message: /Due date object properties must be integers/,
    })
  })

  test('throws for object with invalid calendar date', () => {
    assert.throws(() => convertDueDate({ year: 2027, month: 13, day: 1 }), {
      message: /Due date is not a valid calendar date/,
    })
  })
})

describe('convertIBAN', () => {
  test('converts Finnish IBAN with spaces', () => {
    assert.strictEqual(
      convertIBAN('FI21 1234 5600 0007 85'),
      '2112345600000785',
    )
  })

  test('throws for IBAN with wrong length', () => {
    assert.throws(() => convertIBAN('FI34123456000007853'), {
      message: /Given IBAN must be Finnish IBAN/,
    })
  })

  test('throws for non-Finnish IBAN', () => {
    assert.throws(() => convertIBAN('EE38 2200 2210 2014 5685'), {
      message: /Given IBAN must be Finnish IBAN/,
    })
  })

  test('throws for non-IBAN format', () => {
    assert.throws(() => convertIBAN('623963587892'), {
      message: /Given IBAN must be Finnish IBAN/,
    })
  })

  test('throws when argument is not a string', () => {
    assert.throws(() => convertIBAN(623963587892), {
      message: /IBAN value is not a string/,
    })
  })
})

describe('convertReference', () => {
  test('converts national reference with spaces', () => {
    assert.strictEqual(
      convertReference('12345 67891 23456 78917'),
      '00012345678912345678917',
    )
  })

  test('converts national reference as number', () => {
    assert.strictEqual(convertReference(1232), '00000000000000000001232')
  })

  test('converts international reference with spaces', () => {
    assert.strictEqual(
      convertReference('RF54 1111 35'),
      '54000000000000000111135',
    )
  })

  test('converts international reference without spaces', () => {
    assert.strictEqual(
      convertReference('RF54111135'),
      '54000000000000000111135',
    )
  })

  test('throws when no argument provided', () => {
    assert.throws(() => convertReference(), {
      message: /Given reference is neither number or string/,
    })
  })

  test('throws for invalid reference format', () => {
    assert.throws(() => convertReference('102987-2863'), {
      message: /Given reference is not valid/,
    })
  })
})

describe('referenceToVersion', () => {
  test('returns version 4 for national reference', () => {
    assert.strictEqual(referenceToVersion('12345678912345678917'), 4)
  })

  test('returns version 5 for international reference', () => {
    assert.strictEqual(referenceToVersion('RF54111135'), 5)
  })

  test('throws when no argument provided', () => {
    assert.throws(() => referenceToVersion(), {
      message: /Given reference is neither number or string/,
    })
  })

  test('throws for reference with invalid length', () => {
    assert.throws(() => referenceToVersion('1'), {
      message: /Given reference is not valid/,
    })
  })
})

describe('convertAmountOfCents', () => {
  test('pads single cent correctly', () => {
    assert.strictEqual(convertAmountOfCents(1), '00000001')
  })

  test('pads five euros correctly', () => {
    assert.strictEqual(convertAmountOfCents(500), '00000500')
  })

  test('throws for negative amount', () => {
    assert.throws(() => convertAmountOfCents(-1), {
      message: /Given amount is negative/,
    })
  })

  test('throws for amount exceeding maximum', () => {
    assert.throws(() => convertAmountOfCents(100000000), {
      message: /Given amount is too large/,
    })
  })

  test('throws for floating point amount', () => {
    assert.throws(() => convertAmountOfCents(1.1), {
      message: /Given amount is not an integer/,
    })
  })

  test('throws when argument is not a number', () => {
    assert.throws(() => convertAmountOfCents('1'), {
      message: /Given argument is not a number/,
    })
  })
})

describe('pad', () => {
  test('pads number to specified width', () => {
    assert.strictEqual(pad(22, 6), '000022')
  })

  test('pads single digit to width of 2', () => {
    assert.strictEqual(pad(1, 2), '01')
  })

  test('throws when value exceeds specified width', () => {
    assert.throws(() => pad('100', 1), {
      message: /Value is.*characters long/,
    })
  })

  test('throws when no arguments provided', () => {
    assert.throws(() => pad(), {
      message: /Value must be a string or a number/,
    })
  })

  test('throws when width not provided', () => {
    assert.throws(() => pad('99'), { message: /Width must be a number/ })
  })
})
