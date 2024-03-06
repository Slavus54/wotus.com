import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {SESSION_TYPES, DATES_LIMIT, SERVERS, NATIONS, TANK_TYPES, TANK_LEVEL_LIMIT, PROJECT_TITLE} from '../../env/env'
import {Datus, time_format_min_border, time_format_max_border} from 'datus.js'
import {Context} from '../../context/WebProvider'
import CounterView from '../UI/CounterView'
import FormPagination from '../UI/FormPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {createSessionM} from '../../graphql/pages/SessionPageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateSession: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const datus = new Datus()

    const {context} = useContext<any>(Context)
    const [isTierExist, setIsTierExist] = useState<boolean>(true)
    const [idx, setIdx] = useState<number>(0)
    const [timer, setTimer] = useState<number>(time_format_max_border / 2)
    const [level, setLevel] = useState<number>(TANK_LEVEL_LIMIT / 2)
    const [dates] = useState<string[]>(datus.dates('day', DATES_LIMIT))
    
    const [state, setState] = useState({
        title: '', 
        category: SESSION_TYPES[0], 
        server: SERVERS[0],
        nation: NATIONS[0], 
        levels: [], 
        discord: '', 
        dateUp: dates[0], 
        time: '', 
        technic: TANK_TYPES[0]
    })

    const centum = new Centum()

    const {title, category, server, nation, levels, discord, dateUp, time, technic} = state

    const [createSession] = useMutation(createSessionM, {
        optimisticResponse: true,
        onCompleted(data) {
            UpdatePageWithAlert(data.createSession)
        }
    })

    useEffect(() => {
        centum.title('New Session', PROJECT_TITLE)
    }, [context])

    useMemo(() => {
        let result: string = centum.time(timer)

        setState({...state, time: result})
    }, [timer])

    useEffect(() => {
        let exist: boolean = levels.find(el => el === level) !== undefined

        setIsTierExist(exist)
    }, [level])

    const onTierManage = () => {
        let nextLevel: number = level < TANK_LEVEL_LIMIT ? level + 1 : level - 1
        
        setState({...state, levels: isTierExist ? levels.filter(el => el !== level) : [...levels, level]})
        setLevel(nextLevel)
    }

    const onCreate = () => {
        createSession({
            variables: {
                nickname: context.nickname, id, title, category, server, nation, levels, discord, dateUp, time, technic
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of session' />
                
                        <h4 className='pale'>Group's Type</h4>
                        <div className='items small'>
                            {SESSION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                   
                        <h4 className='pale'>Own Technic's Type</h4>
                        <select value={technic} onChange={e => setState({...state, technic: e.target.value})}>
                            {TANK_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <CounterView num={timer} setNum={setTimer} part={30} min={time_format_min_border} max={time_format_max_border}>
                            Start in {time}
                        </CounterView>                       
                    </>,
                    <>
                        <input value={discord} onChange={e => setState({...state, discord: e.target.value})} placeholder='Discord URL' type='text' />
                        <h4 className='pale'>Server and Tank's Nation</h4>
                        <div className='items small'>
                            <select value={nation} onChange={e => setState({...state, nation: e.target.value})}>
                                {NATIONS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={server} onChange={e => setState({...state, server: e.target.value})}>
                                {SERVERS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <CounterView num={level} setNum={setLevel} part={1} min={1} max={TANK_LEVEL_LIMIT}>
                            Current Tier: {datus.convert(level)}
                        </CounterView> 
                        <button onClick={onTierManage} className='light'>{isTierExist ? '-' : '+'}</button>

                        <div className='items small'>
                            {levels.map(el => <div className='item label'>{datus.convert(el)}</div>)}
                        </div>

                        <h4 className='pale'>Date</h4>
                        <div className='items small'>
                            {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={el === dateUp ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>                      
                    </>
                ]} 
            >
                <h2>New Session</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateSession