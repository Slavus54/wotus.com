import {useMemo, useContext} from 'react'
import {Context} from '../../context/WebProvider'
import Router from '../router/Router'
import {init} from '../../store/localstorage'

const Layout = () => {
    const {change_context, context} = useContext(Context)

    useMemo(() => {
        change_context('create', null)
        init()
    }, [context])

    return (
        <div className='main'>
            <Router account_id={context.account_id} nickname={context.nickname} />
        </div>
    )
}

export default Layout