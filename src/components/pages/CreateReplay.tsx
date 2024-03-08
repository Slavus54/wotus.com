import React, {useState, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import uniqid from 'uniqid'
import {BATTLE_TYPES, GOLDA_TYPES, NOMINATION_TYPES, SERVERS, NATIONS, GOLDEN_ICON, COLLECTION_LIMIT, TANK_LEVEL_LIMIT, PROJECT_TITLE} from '../../env/env'
import {Datus} from 'datus.js'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI/FormPagination'
import CounterView from '../UI/CounterView'
import ImageLook from '../UI/ImageLook'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {createReplayM} from '../../graphql/pages/ReplayPageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateReplay: React.FC<CollectionPropsType> = ({params}) => {
    const datus = new Datus()

    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [level, setLevel] = useState<number>(TANK_LEVEL_LIMIT / 2)
    
    const [nomination, setNomination] = useState({
        id: uniqid(),
        label: '',
        golda: GOLDA_TYPES[0]
    })

    const [state, setState] = useState({
        title: '', 
        category: BATTLE_TYPES[0], 
        server: SERVERS[0],
        nation: NATIONS[0], 
        nominations: []
    })

    const centum = new Centum()

    const {title, category, server, nation, nominations} = state
    const {id, label, golda} = nomination

    const [createReplay] = useMutation(createReplayM, {
        optimisticResponse: true,
        onCompleted(data) {
            UpdatePageWithAlert(data.createReplay)
        }
    })

    useEffect(() => {
        centum.title('New Replay', PROJECT_TITLE)
    }, [context])

    const onNomination = () => {
        if (nominations.length < COLLECTION_LIMIT) {
            setState({...state, nominations: [...nominations, {...nomination, level}]})
        }

        setNomination({
            id: uniqid(),
            label: '',
            golda: GOLDA_TYPES[0]
        })

        setLevel(TANK_LEVEL_LIMIT / 2)
    }

    const onCreate = () => {
        createReplay({
            variables: {
                nickname: context.nickname, id: params.id, title, category, server, nation, nominations
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of replay' />
                
                        <h4 className='pale'>Nominations ({nominations.length}/{COLLECTION_LIMIT})</h4>

                        <input value={label} onChange={e => setNomination({...nomination, label: e.target.value})} placeholder='Title' type='text' />

                        <h4 className='pale'>Type and Golden Award</h4>

                        <ImageLook src={GOLDEN_ICON} min={2} max={2} className='icon' />

                        <div className='items small'>
                            <select value={label} onChange={e => setNomination({...nomination, label: e.target.value})}>
                                {NOMINATION_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={golda} onChange={e => setNomination({...nomination, golda: parseInt(e.target.value)})}>
                                {GOLDA_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>    

                        <CounterView num={level} setNum={setLevel} part={1} min={TANK_LEVEL_LIMIT / 2} max={TANK_LEVEL_LIMIT}>
                            From {datus.convert(level)} tier
                        </CounterView>  
                   
                        <button onClick={onNomination} className='light'>+</button>     
                    </>,
                    <>
                        <h4 className='pale'>Battle's Type</h4>
                        <div className='items small'>
                            {BATTLE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Server and Tank's Nation</h4>
                        <div className='items small'>
                            <select value={nation} onChange={e => setState({...state, nation: e.target.value})}>
                                {NATIONS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={server} onChange={e => setState({...state, server: e.target.value})}>
                                {SERVERS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                   

                        <button onClick={onCreate}>Create</button>   
                    </>
                ]} 
            >
                <h2>New Replay</h2>
            </FormPagination>

            
        </div>
    )
}

export default CreateReplay