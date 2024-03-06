import React, {useState, useEffect, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {LOCATION_TYPES, FACT_LEVELS, TANK_LEVEL_LIMIT, BATTLE_TIME_LIMIT, INITIAL_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import CounterView from '../UI/CounterView'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getAreaM, manageAreaLocationM, updateAreaSettingsM, makeAreaFactM} from '../../graphql/pages/AreaPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Area: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isValidPosition, setIsValidPosition] = useState<boolean>(true)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [tier, setTier] = useState<number>(TANK_LEVEL_LIMIT / 2)
    const [points, setPoints] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    const [area, setArea] = useState<any | null>(null)
    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)
    const [state, setState] = useState<any | null>({
        title: '',
        category: LOCATION_TYPES[0],
        position: '',
        text: '',
        level: FACT_LEVELS[0],
        isTrue: true,
        duration: 0
    })

    const centum = new Centum()
    const datus = new Datus()

    const {title, category, position, text, level, isTrue, duration} = state

    const [getArea] = useMutation(getAreaM, {
        onCompleted(data) {
            setArea(data.getArea)
        }
    })

    const [manageAreaLocation] = useMutation(manageAreaLocationM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageAreaLocation)
        }
    })

    const [updateAreaSettings] = useMutation(updateAreaSettingsM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateAreaSettings)
        }
    })

    const [makeAreaFact] = useMutation(makeAreaFactM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.makeAreaFact)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getArea({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (area !== null) {
            let result: number = centum.percent(area.duration, BATTLE_TIME_LIMIT, 0)

            setPercent(result)
            setCords(area.cords)
            setTier(area.tier)           
        }
    }, [area])

    useMemo(() => {
        let result: number = centum.part(percent, BATTLE_TIME_LIMIT, 0)

        setState({...state, duration: result})
    }, [percent])

    useMemo(() => {
        let flag: boolean = true
        
        if (position.length !== 2) {
            flag = false
        } else {
            flag = isNaN(position[0]) === true && isNaN(position[1]) === false 
        }

        setIsValidPosition(flag)
    }, [position])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onFact = () => {
        if (fact === null) {
            let result = centum.random(area.facts)?.value

            if (result !== undefined) {
                setFact(result)
            }

        } else {
            let award: number = FACT_LEVELS.indexOf(fact.level) + 1

            if (fact.isTrue === isTrue) {
                setPoints(points + award)
            }

            setFact(null)
        }
    }

    const onManageLocation = (option: string) => {
        manageAreaLocation({
            variables: {
                nickname: context.nickname, id, option, title, category, position, cords, image, coll_id: location === null ? '' : location.shortid
            }
        })
    }

    const onUpdateSettings = () => {
        updateAreaSettings({
            variables: {
                nickname: context.nickname, id, tier, duration
            }
        })
    }

    const onMakeFact = () => {
        makeAreaFact({
            variables: {
                nickname: context.nickname, id, text, level, isTrue
            }
        })
    }

    return (
        <>          
            {area !== null &&
                <>
                    <h2>{area.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Battle Type's: {area.mode}</h4>
                        <h4 className='pale'>Size: {area.size}x{area.size}</h4>
                    </div>

                    <h2>Game Settings</h2>

                    <h4 className='pale'>Battle's Time: <b>{duration}</b> minutes</h4>
                    <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={5} />  

                    <CounterView num={tier} setNum={setTier} part={1} min={1} max={TANK_LEVEL_LIMIT}>
                        Play since {datus.convert(tier)} tier
                    </CounterView>

                    <button onClick={onUpdateSettings} className='light'>Update</button>

                    {location === null ? 
                            <>
                                <h2>New Location</h2>

                                <div className='items small'>
                                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of location' type='text' />
                                    <input value={position} onChange={e => setState({...state, position: e.target.value})} placeholder='Coordinates: A2, K0' type='text' />
                                </div>
                            
                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <ImageLoader setImage={setImage} />

                                {isValidPosition ? 
                                        <button onClick={() => onManageLocation('create')}>Create</button>
                                    :
                                        <p>Position is not valid</p>
                                }

                                <DataPagination initialItems={area.locations} setItems={setLocations} label='Locations on Map:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo_item' alt='location image' />}

                                <h2>{location.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {location.category}</h4>
                                    <h4 className='pale'><b>{location.likes}</b> likes</h4>
                                </div>

                                {location.name === context.nickname ? 
                                        <button onClick={() => onManageLocation('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageLocation('like')}>Like</button>
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {locations.map(el => 
                            <Marker onClick={() => setLocation(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL>

                    {fact === null ? 
                            <>
                                <h2>New Fact</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {FACT_LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='item'>Veracity: {isTrue ? 'Truth' : 'Lie'}</p>

                                {text.length !== 0 && <button onClick={onMakeFact}>Publish</button>}

                                <h2>Game</h2>

                                <h4 className='pale'>Points: <b>{points}</b></h4>

                                <button onClick={onFact} className='light'>New</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <h2>{fact.text}</h2>
                                <h4 className='pale'>Difficulty: {fact.level}</h4>

                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='item'>Veracity: {isTrue ? 'Truth' : 'Lie'}</p>

                                <button onClick={onFact} className='light'>Check</button>
                            </>
                    }
                </>
            }

            {area === null && <Loading loadLabel="Area's" />}
        </>
    )
}

export default Area