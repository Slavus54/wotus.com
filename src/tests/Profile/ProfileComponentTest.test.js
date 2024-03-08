import {findTownByTitle, checkTownsStructure} from '../test-api'

describe('Full Profile Component Testing', () => {
    test('Trying to find another region to update it in my profile', () => {
        
        let attempts = ['Novosibirsk', 'Novosib']
        
        attempts.map(async (el) => {
            let data = await findTownByTitle(el)

            expect(data).toBe(true)
        })
    })

    test('Check property "title" in random item from Towns API', () => {
        
        let property = 'title'
        
        expect(checkTownsStructure(property)).not.toBe(undefined)
    })
})