import { test } from 'node:test'
import virtuaaliviivakoodi from '../dist/index.js'

test('main function in ESM', { plan: 7 }, (t) => {
  t.assert.strictEqual(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 11112,
      cents: 1225,
      due: '161221',
    }),
    '437159030000007760000122500000000000000000011112161221',
    'Full information on v4',
  )

  t.assert.strictEqual(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 'RF9811112',
      cents: 110,
      due: '170101',
    }),
    '537159030000007760000011098000000000000000011112170101',
    'Full information on v5',
  )

  t.assert.strictEqual(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 11112,
    }),
    '437159030000007760000000000000000000000000011112000000',
    'No amount and due date given',
  )

  t.assert.throws(
    () => {
      virtuaaliviivakoodi()
    },
    { message: /Object must be given as parameter/ },
    'No argument given',
  )

  t.assert.throws(
    () => {
      virtuaaliviivakoodi({
        reference: 'RF9811112',
        amount: 1.1,
        due: '170101',
      })
    },
    { message: /No IBAN specified/ },
    'No IBAN given',
  )

  t.assert.throws(
    () => {
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        amount: 1.1,
        due: '170101',
      })
    },
    { message: /No reference specified/ },
    'No reference number given',
  )

  t.assert.throws(
    () => {
      virtuaaliviivakoodi({
        iban: 'FI37 1590 3000 0007 76',
        due: '170101',
        reference: 11112,
        amount: 1.1,
      })
    },
    { message: /options.amount is unsupported/ },
    'Removed option amount given',
  )
})
