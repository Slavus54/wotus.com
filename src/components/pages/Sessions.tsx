import React, {useState, useEffect, useMemo, useContext} from 'react'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {SESSION_TYPES, NATIONS, SERVERS, SEARCH_PERCENT, PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import CounterView from '../UI/CounterView'
import DataPagination from '../UI/DataPagination'
import {getSessionsQ} from '../../graphql/pages/SessionPageQueries'

const Sessions: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [sessions, setSessions] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(SESSION_TYPES[0])
    const [nation, setNation] = useState<string>(NATIONS[0])
    const [server, setServer] = useState<string>(SERVERS[0])

    const centum = new Centum()
    const datus = new Datus()

    const {data, loading} = useQuery(getSessionsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setSessions(data.getSessions)

            centum.title('Sessions', PROJECT_TITLE)
        }
    }, [data])

    useMemo(() => {
        if (sessions !== null) {
            let result: any[] = sessions.filter(el => el.category === category && el.nation === nation)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.server === server)

            setFiltered(result)
        }
    }, [sessions, title, category, nation, server])

    return (
        <>          
            <h1>Play now on {server}</h1>

            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Enter title' type='text' />
    
            <h4 className='pale'>Group's Type</h4>
            <div className='items small'>
                {SESSION_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>
        
            <h4 className='pale'>Server and Tank's Nation</h4>
            <div className='items small'>
                <select value={nation} onChange={e => setNation(e.target.value)}>
                    {NATIONS.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={server} onChange={e => setServer(e.target.value)}>
                    {SERVERS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of Sessions:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/session/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                                <p>{el.dateUp}</p>
                            </NavigatorWrapper>
                        </div>    
                    )}
                </div>
            }

            {loading && <Loading loadLabel='Sessions' />}
        </>
    )
}

export default Sessions