import axios from 'axios' 
import {TOWNS_API_ENDPOINT} from '../env/env'

// Towns API

const api_key = 'eu-towns'
const nick_key = 'wot-nickname'

export const init = async () => {
    let check = localStorage.getItem(api_key)

    if (check === null) {
        let data = (await axios.get(TOWNS_API_ENDPOINT)).data

        localStorage.setItem(api_key, JSON.stringify(data))
    } 
}

export const gain = () => {
    return JSON.parse(localStorage.getItem(api_key))
}

// Nickname Persist

export const updateNickname = nickname => {
    localStorage.setItem(nick_key, JSON.stringify(nickname))
}

export const getNickname = () => {
    let data = localStorage.getItem(nick_key)

    return data === null ? '' : JSON.parse(data)
}