import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {AREA_TYPES, MAP_SIZES, BATTLE_TIME_LIMIT, BATTLE_TYPES, SEARCH_PERCENT, INITIAL_PERCENT, TANK_LEVEL_LIMIT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import CounterView from '../UI/CounterView'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {createAreaM} from '../../graphql/pages/AreaPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateArea: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [tier, setTier] = useState<number>(TANK_LEVEL_LIMIT / 2)

    const [state, setState] = useState({
        title: '', 
        category: AREA_TYPES[0], 
        mode: BATTLE_TYPES[0], 
        size: MAP_SIZES[0],
        region: towns[0].title, 
        cords: towns[0].cords,
        duration: 0
    })

    const centum = new Centum()
    const datus = new Datus()

    const {title, category, mode, size, region, cords, duration} = state

    const [createArea] = useMutation(createAreaM, {
        optimisticResponse: true,
        onCompleted(data) {
            UpdatePageWithAlert(data.createArea)
        }
    })

    useEffect(() => {
        centum.title('New Area', PROJECT_TITLE)
    }, [context])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        let result: number = centum.part(percent, BATTLE_TIME_LIMIT, 0)

        setState({...state, duration: result})
    }, [percent])

    const onCreate = () => {
        createArea({
            variables: {
                nickname: context.nickname, id: params.id, title, category, mode, size, region, cords, tier, duration
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of map' type='text' />
                
                        <h4 className='pale'>Category</h4>
                        <div className='items small'>
                            {AREA_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>   

                        <CounterView num={tier} setNum={setTier} part={1} min={1} max={TANK_LEVEL_LIMIT}>
                            Play since {datus.convert(tier)} tier
                        </CounterView>

                        <h4 className='pale'>Battle's Type and Size</h4>
                        <div className='items small'>
                            <select value={mode} onChange={e => setState({...state, mode: e.target.value})}>
                                {BATTLE_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select> 
                            <select value={size} onChange={e => setState({...state, size: parseInt(e.target.value)})}>
                                {MAP_SIZES.map(el => <option value={el}>{el}</option>)}
                            </select>         
                        </div>    

                        <h4 className='pale'>Battle's Time: <b>{duration}</b> minutes</h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={5} />             
                    </>,
                    <>
                        
                        <h4 className='pale'>Where it located?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>   

                        <button onClick={onCreate}>Create</button>                 
                    </>
                ]} 
            >
                <h2>New Area</h2>
            </FormPagination>        
        </div>
    )
}

export default CreateArea