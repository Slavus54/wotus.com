import React, {useState, createContext} from 'react'
import {useLocation} from 'wouter'
//@ts-ignore
import Cookies from 'js-cookie'
import {ContextStateType} from '../types/types'

export const initialState: ContextStateType = {
    account_id: '',
    nickname: '',
    server: '',
    nation: ''
}

export const context_name = 'profile'
export const Context = createContext<any>(initialState)

type Props = {
    children: React.ReactNode
}

export const WebProvider = ({children}: Props) => {
    const [loc, setLoc] = useLocation()
    const [context, setContext] = useState(initialState) 

    const change_context = (command = 'create', data = null, expires = 1, redirect_url = '/') => {
        if (command === 'create') {
            let cookie = Cookies.get(context_name)
            let result = cookie === undefined ? null : JSON.parse(cookie)

            if (result === null) {
                Cookies.set(context_name, result, {expires: 1})
            } else {
                setContext({...context, account_id: result.account_id, nickname: result.nickname, server: result.server, nation: result.nation})
            }
        } else if (command === 'update') {
            Cookies.set(context_name, JSON.stringify(data), {expires})

            setLoc(redirect_url)
            window.location.reload()
        }   
    }

    return <Context.Provider value={{context, change_context}}>{children}</Context.Provider>
}