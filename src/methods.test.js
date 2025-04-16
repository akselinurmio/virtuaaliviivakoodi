import { test } from 'tap'
import {
  checkDue,
  convertAmountOfCents,
  convertIBAN,
  convertReference,
  countDecimals,
  pad,
  referenceToVersion,
} from './methods.js'

test('check due dates', (t) => {
  t.plan(3)

  t.equal(checkDue('160222'), '160222', 'Valid argument')

  t.throws(() => {
    checkDue()
  }, 'No argument')

  t.throws(() => {
    checkDue('20170920')
  }, 'Argument is string but not valid')
})

test('convert ibans', (t) => {
  t.plan(5)

  t.equal(convertIBAN('FI21 1234 5600 0007 85'), '2112345600000785')
  t.throws(() => {
    convertIBAN('FI34123456000007853')
  }, "Isn't of right length")
  t.throws(() => {
    convertIBAN('EE38 2200 2210 2014 5685')
  }, "Isn't Finnish")
  t.throws(() => {
    convertIBAN('623963587892')
  }, "Isn't IBAN")
  t.throws(() => {
    convertIBAN(623963587892)
  }, "Isn't a string")
})

test('convert reference numbers', (t) => {
  t.plan(6)

  t.equal(
    convertReference('12345 67891 23456 78917'),
    '00012345678912345678917',
    'National reference with spaces',
  )
  t.equal(
    convertReference(1232),
    '00000000000000000001232',
    'National reference as number',
  )

  t.equal(
    convertReference('RF54 1111 35'),
    '54000000000000000111135',
    'International reference with spaces',
  )
  t.equal(
    convertReference('RF54111135'),
    '54000000000000000111135',
    'International reference',
  )

  t.throws(() => {
    convertReference()
  }, 'No argument')
  t.throws(() => {
    convertReference('102987-2863')
  }, 'Argument not valid')
})

test('determine version', (t) => {
  t.plan(4)

  t.equal(referenceToVersion('12345678912345678917'), 4, 'National reference')
  t.equal(referenceToVersion('RF54111135'), 5, 'International reference')

  t.throws(() => {
    referenceToVersion()
  }, 'No argument')
  t.throws(() => {
    referenceToVersion('1')
  }, 'Argument not right length')
})

test('count amounts of cents', (t) => {
  t.plan(6)

  t.equal(convertAmountOfCents(1), '00000001', 'One cent')
  t.equal(convertAmountOfCents(500), '00000500', 'Five euros')

  t.throws(() => {
    convertAmountOfCents(-1)
  }, 'Negative')
  t.throws(() => {
    convertAmountOfCents(100000000)
  }, 'Too many cents')
  t.throws(() => {
    convertAmountOfCents(1.1)
  }, 'Floating point')
  t.throws(() => {
    convertAmountOfCents('1')
  }, 'String as an argument')
})

test('count decimals', (t) => {
  t.plan(5)

  t.equal(countDecimals(120), 0, 'No decimals')
  t.equal(countDecimals(12.1), 1, 'One decimal')
  t.equal(countDecimals(12.12), 2, 'Two decimals')
  t.equal(countDecimals(Math.PI), 15, 'Maximum amount of decimals')

  t.throws(() => {
    countDecimals('120')
  }, 'String as an argument')
})

test('pad correctly', (t) => {
  t.plan(5)

  t.equal(pad(22, 6), '000022')
  t.equal(pad(1, 2), '01')

  t.throws(() => {
    pad('100', 1)
  }, 'Value is longer than given length')
  t.throws(() => {
    pad()
  }, 'No arguments')
  t.throws(() => {
    pad('99')
  }, 'No width')
})
