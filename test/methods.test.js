import { test } from 'node:test'
import {
  checkDue,
  convertAmountOfCents,
  convertIBAN,
  convertReference,
  pad,
  referenceToVersion,
} from '../src/methods.ts'

test('check due dates', { plan: 3 }, (t) => {
  t.assert.strictEqual(checkDue('160222'), '160222', 'Valid argument')

  t.assert.throws(
    () => {
      checkDue()
    },
    { message: /Due date is not a string/ },
    'No argument',
  )

  t.assert.throws(
    () => {
      checkDue('20170920')
    },
    { message: /Due date is not valid/ },
    'Argument is string but not valid',
  )
})

test('convert ibans', { plan: 5 }, (t) => {
  t.assert.strictEqual(
    convertIBAN('FI21 1234 5600 0007 85'),
    '2112345600000785',
  )
  t.assert.throws(
    () => {
      convertIBAN('FI34123456000007853')
    },
    { message: /Given IBAN must be Finnish IBAN/ },
    "Isn't of right length",
  )
  t.assert.throws(
    () => {
      convertIBAN('EE38 2200 2210 2014 5685')
    },
    { message: /Given IBAN must be Finnish IBAN/ },
    "Isn't Finnish",
  )
  t.assert.throws(
    () => {
      convertIBAN('623963587892')
    },
    { message: /Given IBAN must be Finnish IBAN/ },
    "Isn't IBAN",
  )
  t.assert.throws(
    () => {
      convertIBAN(623963587892)
    },
    { message: /IBAN value is not a string/ },
    "Isn't a string",
  )
})

test('convert reference numbers', { plan: 6 }, (t) => {
  t.assert.strictEqual(
    convertReference('12345 67891 23456 78917'),
    '00012345678912345678917',
    'National reference with spaces',
  )
  t.assert.strictEqual(
    convertReference(1232),
    '00000000000000000001232',
    'National reference as number',
  )

  t.assert.strictEqual(
    convertReference('RF54 1111 35'),
    '54000000000000000111135',
    'International reference with spaces',
  )
  t.assert.strictEqual(
    convertReference('RF54111135'),
    '54000000000000000111135',
    'International reference',
  )

  t.assert.throws(
    () => {
      convertReference()
    },
    { message: /Given reference is neither number or string/ },
    'No argument',
  )
  t.assert.throws(
    () => {
      convertReference('102987-2863')
    },
    { message: /Given reference is not valid/ },
    'Argument not valid',
  )
})

test('determine version', { plan: 4 }, (t) => {
  t.assert.strictEqual(
    referenceToVersion('12345678912345678917'),
    4,
    'National reference',
  )
  t.assert.strictEqual(
    referenceToVersion('RF54111135'),
    5,
    'International reference',
  )

  t.assert.throws(
    () => {
      referenceToVersion()
    },
    { message: /Given reference is neither number or string/ },
    'No argument',
  )
  t.assert.throws(
    () => {
      referenceToVersion('1')
    },
    { message: /Given reference is not valid/ },
    'Argument not right length',
  )
})

test('count amounts of cents', { plan: 6 }, (t) => {
  t.assert.strictEqual(convertAmountOfCents(1), '00000001', 'One cent')
  t.assert.strictEqual(convertAmountOfCents(500), '00000500', 'Five euros')

  t.assert.throws(
    () => {
      convertAmountOfCents(-1)
    },
    { message: /Given amount is negative/ },
    'Negative',
  )
  t.assert.throws(
    () => {
      convertAmountOfCents(100000000)
    },
    { message: /Given amount is too large/ },
    'Too many cents',
  )
  t.assert.throws(
    () => {
      convertAmountOfCents(1.1)
    },
    { message: /Given amount is not an integer/ },
    'Floating point',
  )
  t.assert.throws(
    () => {
      convertAmountOfCents('1')
    },
    { message: /Given argument is not a number/ },
    'String as an argument',
  )
})

test('pad correctly', { plan: 5 }, (t) => {
  t.assert.strictEqual(pad(22, 6), '000022')
  t.assert.strictEqual(pad(1, 2), '01')

  t.assert.throws(
    () => {
      pad('100', 1)
    },
    { message: /Value is.*characters long/ },
    'Value is longer than given length',
  )
  t.assert.throws(
    () => {
      pad()
    },
    { message: /Value must be a string or a number/ },
    'No arguments',
  )
  t.assert.throws(
    () => {
      pad('99')
    },
    { message: /Width must be a number/ },
    'No width',
  )
})
