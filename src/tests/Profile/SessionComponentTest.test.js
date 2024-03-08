const {initialDateChecking, generateTimestamp, generateTime} = require('../test-api')

describe('Session Component Testing (Datus.js and API)', () => {
    test('Generate random date and validate it', () => {
        expect(initialDateChecking()).toBe(true)
    })

    test('Generate timestamp of award publishing', () => {
        expect(generateTimestamp()).not.toBe(undefined)
    })

    test('Check time format', () => {
        expect(generateTime()).toBe(true)
    })
})