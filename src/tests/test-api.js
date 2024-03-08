const Centum = require('centum.js')
const {Datus, time_format_max_border} = require('datus.js')
const axios = require('axios')
const {SEARCH_PERCENT, TOWNS_API_ENDPOINT, DATES_LIMIT} = require('../env/env')

const centum = new Centum()
const datus = new Datus()

const getTowns = async () => {
    let {data} = await axios.get(TOWNS_API_ENDPOINT)

    return data
}

const towns = new Promise((resolve, reject) => {
    let data = getTowns()

    if (!data) {
        reject()
    }

    resolve(data)
})

const findTownByTitle = (title) => {
    const result = towns.then(data => data.find(el => centum.search(el.title, title, SEARCH_PERCENT)))
   
    return result !== undefined
}

const checkTownsStructure = (property) => {
    const result = towns.then(data => {
        let index = parseInt(data.length * Math.random())
        let region = data[index]

        return region[property]
    })        

    return result
}

const initialDateChecking = () => {
    let dates = datus.dates('day', DATES_LIMIT)
    let date = centum.random(dates)?.value /// random date from array

    let flag = typeof date === 'string'

    flag = date.split('.').length === 3

    return flag
}

const generateTimestamp = () => {
    let timestamp = datus.timestamp() // timestamp of publishing battle's award while game session

    return timestamp
}

const generateTime = () => {
    let timer = parseInt(time_format_max_border * Math.random())
    let time = datus.time(timer)

    let flag = typeof time === 'string'

    if (flag) {
        flag = time.split(':').length === 2
    }   

    return flag 
}

module.exports = {findTownByTitle, checkTownsStructure, initialDateChecking, generateTimestamp, generateTime}