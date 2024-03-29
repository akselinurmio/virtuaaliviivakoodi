const test = require('tap').test
const virtuaaliviivakoodi = require('./')

test('main function', function mainFunctionTests(t) {
  t.plan(7)

  t.equal(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 11112,
      cents: 1225,
      due: '161221',
    }),
    '437159030000007760000122500000000000000000011112161221',
    'Full information on v4'
  )

  t.equal(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 'RF9811112',
      cents: 110,
      due: '170101',
    }),
    '537159030000007760000011098000000000000000011112170101',
    'Full information on v5'
  )

  t.equal(
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      reference: 11112,
    }),
    '437159030000007760000000000000000000000000011112000000',
    'No amount and due date given'
  )

  t.throws(function () {
    virtuaaliviivakoodi()
  }, 'No argument given')

  t.throws(function () {
    virtuaaliviivakoodi({
      reference: 'RF9811112',
      amount: 1.1,
      due: '170101',
    })
  }, 'No IBAN given')

  t.throws(function () {
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      amount: 1.1,
      due: '170101',
    })
  }, 'No reference number given')

  t.throws(function () {
    virtuaaliviivakoodi({
      iban: 'FI37 1590 3000 0007 76',
      due: '170101',
      reference: 11112,
      amount: 1.1,
    })
  }, 'Removed option amount given')
})
