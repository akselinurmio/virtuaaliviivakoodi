const test = require('tap').test
const methods = require('./methods')

test('check due dates', function checkDueTests(t) {
  t.plan(3)

  t.equal(methods.checkDue('160222'), '160222', 'Valid argument')

  t.throws(function () {
    methods.checkDue()
  }, 'No argument')

  t.throws(function () {
    methods.checkDue('20170920')
  }, 'Argument is string but not valid')
})

test('convert ibans', function convertIBANTests(t) {
  t.plan(5)

  t.equal(methods.convertIBAN('FI21 1234 5600 0007 85'), '2112345600000785')
  t.throws(function () {
    methods.convertIBAN('FI34123456000007853')
  }, "Isn't of right length")
  t.throws(function () {
    methods.convertIBAN('EE38 2200 2210 2014 5685')
  }, "Isn't Finnish")
  t.throws(function () {
    methods.convertIBAN('623963587892')
  }, "Isn't IBAN")
  t.throws(function () {
    methods.convertIBAN(623963587892)
  }, "Isn't a string")
})

test('convert reference numbers', function convertReferenceTests(t) {
  t.plan(6)

  t.equal(
    methods.convertReference('12345 67891 23456 78917'),
    '00012345678912345678917',
    'National reference with spaces'
  )
  t.equal(
    methods.convertReference(1232),
    '00000000000000000001232',
    'National reference as number'
  )

  t.equal(
    methods.convertReference('RF54 1111 35'),
    '54000000000000000111135',
    'International reference with spaces'
  )
  t.equal(
    methods.convertReference('RF54111135'),
    '54000000000000000111135',
    'International reference'
  )

  t.throws(function () {
    methods.convertReference()
  }, 'No argument')
  t.throws(function () {
    methods.convertReference('102987-2863')
  }, 'Argument not valid')
})

test('determine version', function determineVersionTests(t) {
  t.plan(4)

  t.equal(
    methods.referenceToVersion('12345678912345678917'),
    4,
    'National reference'
  )
  t.equal(
    methods.referenceToVersion('RF54111135'),
    5,
    'International reference'
  )

  t.throws(function () {
    methods.referenceToVersion()
  }, 'No argument')
  t.throws(function () {
    methods.referenceToVersion('1')
  }, 'Argument not right length')
})

test('count amounts of cents', function convertAmountOfCentsTests(t) {
  t.plan(6)

  t.equal(methods.convertAmountOfCents(1), '00000001', 'One cent')
  t.equal(methods.convertAmountOfCents(500), '00000500', 'Five euros')

  t.throws(function () {
    methods.convertAmountOfCents(-1)
  }, 'Negative')
  t.throws(function () {
    methods.convertAmountOfCents(100000000)
  }, 'Too many cents')
  t.throws(function () {
    methods.convertAmountOfCents(1.1)
  }, 'Floating point')
  t.throws(function () {
    methods.convertAmountOfCents('1')
  }, 'String as an argument')
})

test('count decimals', function countDecimals(t) {
  t.plan(5)

  t.equal(methods.countDecimals(120), 0, 'No decimals')
  t.equal(methods.countDecimals(12.1), 1, 'One decimal')
  t.equal(methods.countDecimals(12.12), 2, 'Two decimals')
  t.equal(methods.countDecimals(Math.PI), 15, 'Maximum amount of decimals')

  t.throws(function () {
    methods.countDecimals('120')
  }, 'String as an argument')
})

test('pad correctly', function padTests(t) {
  t.plan(5)

  t.equal(methods.pad(22, 6), '000022')
  t.equal(methods.pad(1, 2), '01')

  t.throws(function () {
    methods.pad('100', 1)
  }, 'Value is longer than given length')
  t.throws(function () {
    methods.pad()
  }, 'No arguments')
  t.throws(function () {
    methods.pad('99')
  }, 'No width')
})
