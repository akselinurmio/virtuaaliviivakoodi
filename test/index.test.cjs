const { describe, test } = require('node:test')
const assert = require('node:assert')
const virtuaaliviivakoodi = require('../dist/index.cjs')

describe('virtuaaliviivakoodi CJS', () => {
  test('generates barcode with full information using national reference (v4)', () => {
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 11112,
        cents: 1225,
        due: '161221',
      }),
      '437159030000007760000122500000000000000000011112161221',
    )
  })

  test('generates barcode with full information using international reference (v5)', () => {
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 'RF9811112',
        cents: 110,
        due: '170101',
      }),
      '537159030000007760000011098000000000000000011112170101',
    )
  })

  test('generates barcode without amount and due date', () => {
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 11112,
      }),
      '437159030000007760000000000000000000000000011112000000',
    )
  })

  test('throws when no argument given', () => {
    assert.throws(() => virtuaaliviivakoodi(), {
      message: /Object must be given as parameter/,
    })
  })

  test('throws when no IBAN specified', () => {
    assert.throws(
      () =>
        virtuaaliviivakoodi({
          reference: 'RF9811112',
          amount: 1.1,
          due: '170101',
        }),
      { message: /No IBAN specified/ },
    )
  })

  test('throws when no reference specified', () => {
    assert.throws(
      () =>
        virtuaaliviivakoodi({
          iban: 'FI37 1590 3000 0007 76',
          due: '170101',
        }),
      { message: /No reference specified/ },
    )
  })

  test('throws when deprecated amount option is used', () => {
    assert.throws(
      () =>
        virtuaaliviivakoodi({
          iban: 'FI37 1590 3000 0007 76',
          due: '170101',
          reference: 11112,
          amount: 1.1,
        }),
      { message: /options.amount is unsupported/ },
    )
  })

  test('generates barcode with ISO 8601 due date', () => {
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 11112,
        cents: 1225,
        due: '2016-12-21',
      }),
      '437159030000007760000122500000000000000000011112161221',
    )
  })

  test('generates barcode with date object', () => {
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 11112,
        cents: 1225,
        due: { year: 2016, month: 12, day: 21 },
      }),
      '437159030000007760000122500000000000000000011112161221',
    )
  })

  test('ISO 8601 due date produces same result as YYMMDD', () => {
    const expected = virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 'RF9811112',
      cents: 110,
      due: '170101',
    })
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 'RF9811112',
        cents: 110,
        due: '2017-01-01',
      }),
      expected,
    )
  })

  test('date object produces same result as YYMMDD', () => {
    const expected = virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 'RF9811112',
      cents: 110,
      due: '170101',
    })
    assert.strictEqual(
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        reference: 'RF9811112',
        cents: 110,
        due: { year: 2017, month: 1, day: 1 },
      }),
      expected,
    )
  })
})
