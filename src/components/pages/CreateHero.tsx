import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import uniqid from 'uniqid'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {HERO_TYPES, RANKS, TANK_TYPES, SEARCH_PERCENT, COLLECTION_LIMIT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {createHeroM} from '../../graphql/pages/HeroPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateHero: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    
    const [vehicle, setVehicle] = useState({
        id: uniqid(),
        title: '',
        format: TANK_TYPES[0],
        experience: 0
    })

    const [state, setState] = useState({
        fullname: '', 
        category: HERO_TYPES[0], 
        rank: RANKS[0], 
        vehicles: [], 
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {fullname, category, rank, vehicles, region, cords} = state
    const {id, title, format, experience} = vehicle

    const [createHero] = useMutation(createHeroM, {
        optimisticResponse: true,
        onCompleted(data) {
            UpdatePageWithAlert(data.createHero)
        }
    })

    useEffect(() => {
        centum.title('New Hero', PROJECT_TITLE)
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

    const onVehicle = () => {
        if (vehicles.length < COLLECTION_LIMIT) {
            setState({...state, vehicles: [...vehicles, {...vehicle, image}]})
        }

        setVehicle({
            id: uniqid(),
            title: '',
            format: TANK_TYPES[0],
            experience: 0
        })
        setImage('')
    }

    const onCreate = () => {
        createHero({
            variables: {
                nickname: context.nickname, id: params.id, fullname, category, rank, vehicles, region, cords
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <textarea value={fullname} onChange={e => setState({...state, fullname: e.target.value})} placeholder='Fullname of person' />
                
                        <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                            {HERO_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>       

                        <h4 className='pale'>Rank</h4>
                        <div className='items small'>
                            {RANKS.map(el => <div onClick={() => setState({...state, rank: el})} className={el === rank ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>            
                    </>,
                    <>
                        <h4 className='pale'>Vehicles ({vehicles.length}/{COLLECTION_LIMIT})</h4>
                        <input value={title} onChange={e => setVehicle({...vehicle, title: e.target.value})} placeholder='Title' type='text' />
                        
                        <select value={format} onChange={e => setVehicle({...vehicle, format: e.target.value})}>
                            {TANK_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select> 

                        <ImageLoader setImage={setImage} />

                        <button onClick={onVehicle}>+</button>
                    </>,
                    <>
                        
                        <h4 className='pale'>Where he was born?</h4>
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
                <h2>New Hero</h2>
            </FormPagination>        
        </div>
    )
}

export default CreateHero