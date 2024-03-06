import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {TANK_TYPES, NATIONS, TANK_ROLES, TANK_LEVEL_LIMIT, TANK_EXP_LIMIT, INITIAL_PERCENT, PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import CounterView from '../UI/CounterView'
import FormPagination from '../UI/FormPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {createTankM} from '../../graphql/pages/TankPageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateTank: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [level, setLevel] = useState<number>(TANK_LEVEL_LIMIT / 2)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)

    const datus = new Datus()

    const [state, setState] = useState({
        title: '', 
        category: TANK_TYPES[0], 
        nation: NATIONS[0], 
        role: TANK_ROLES[0], 
        experience: 0, 
        dateUp: datus.move()
    })

    const centum = new Centum()

    const {title, category, nation, role, experience, dateUp} = state

    const [createTank] = useMutation(createTankM, {
        optimisticResponse: true,
        onCompleted(data) {
            UpdatePageWithAlert(data.createTank)
        }
    })

    useEffect(() => {
        centum.title('New Tank', PROJECT_TITLE)
    }, [context])

    useMemo(() => {
        setState({...state, experience: centum.part(percent, TANK_EXP_LIMIT)})
    }, [percent])

    const onCreate = () => {
        createTank({
            variables: {
                nickname: context.nickname, id, title, category, nation, role, level, experience, dateUp
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Model's Title</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Enter title' type='text' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {TANK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                   
                        <CounterView num={level} setNum={setLevel} part={1} min={1} max={TANK_LEVEL_LIMIT}>
                            Tier: {datus.convert(level)}
                        </CounterView>
                    </>,
                    <>
                        <h4 className='pale'>Tank's Nation and Role</h4>
                        <div className='items small'>
                            <select value={nation} onChange={e => setState({...state, nation: e.target.value})}>
                                {NATIONS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                                {TANK_ROLES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <h4 className='pale'>Cost of Experience: <b>{experience}K</b></h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                    </>
                ]} 
            >
                <h2>New Tank</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateTank