import React, {useState, useEffect, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {ARTIFACT_TYPES, QUESTION_THEMES, EXP_VEHICLE_LIMIT, INITIAL_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import MapPicker from '../UI/MapPicker'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getHeroM, manageHeroArtifactM, updateHeroVehicleM, manageHeroQuestionM} from '../../graphql/pages/HeroPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Hero: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [image, setImage] = useState<string>('')
    const [hero, setHero] = useState<any | null>(null)
    const [vehicles, setVehicles] = useState<any[]>([])
    const [vehicle, setVehicle] = useState<any | null>(null)
    const [artifacts, setArtifacts] = useState<any[]>([])
    const [artifact, setArtifact] = useState<any | null>(null)
    const [question, setQuestion] = useState<any | null>(null)

    const [state, setState] = useState({
        title: '',
        category: ARTIFACT_TYPES[0],
        prevalence: INITIAL_PERCENT,
        text: '',
        theme: QUESTION_THEMES[0],
        reply: '',
        experience: 0
    })

    const centum = new Centum()

    const {title, category, prevalence, text, theme, reply, experience} = state

    const [getHero] = useMutation(getHeroM, {
        onCompleted(data) {
            setHero(data.getHero)
        }
    })

    const [manageHeroArtifact] = useMutation(manageHeroArtifactM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageHeroArtifact)
        }
    })

    const [updateHeroVehicle] = useMutation(updateHeroVehicleM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateHeroVehicle)
        }
    })

    const [manageHeroQuestion] = useMutation(manageHeroQuestionM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageHeroQuestion)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getHero({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (hero !== null) {
            setCords(hero.cords)         
        }
    }, [hero])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        setState({...state, reply: question === null ? '' : question.reply})
    }, [question])

    useMemo(() => {
        let result: number = centum.part(percent, EXP_VEHICLE_LIMIT)
        
        setState({...state, experience: result})
    }, [percent])

    const onQuestion = () => {
        let result = centum.random(hero.questions)?.value

        if (result !== undefined) {
            setQuestion(result)
        }
    }   

    const onManageArtifact = (option: string) => {
        manageHeroArtifact({
            variables: {
                nickname: context.nickname, id, option, title, category, prevalence, image, coll_id: artifact === null ? '' : artifact.shortid
            }
        })
    } 

    const onUpdateVehicle = () => {
        updateHeroVehicle({
            variables: {
                nickname: context.nickname, id, coll_id: vehicle !== null ? vehicle.id : '', experience
            }
        })
    }

    const onManageQuestion = (option: string) => {
        manageHeroQuestion({
            variables: {
                nickname: context.nickname, id, option, text, theme, reply, coll_id: question === null ? '' : question.shortid
            }
        })
    } 

    return (
        <>          
            {hero !== null &&
                <>
                    <h2>{hero.fullname}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Role: {hero.category}</h4>
                        <h4 className='pale'>Rank: {hero.rank}</h4>
                    </div>

                    {question === null ?
                            <button onClick={onQuestion}>Question</button>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>{question.text}?</h2>
                                <h4 className='pale'>Theme: {question.theme}</h4>

                                {question.answered && <p>Reply: {question.reply}</p>}

                                {!question.answered && hero.nickname === context.nickname &&
                                    <>
                                        <h2>Give Reply</h2>
                                        <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Text...' />

                                        <button onClick={() => onManageQuestion('reply')}>Answer</button>
                                    </>
                                }

                                {question.name === context.nickname && <button onClick={() => onManageQuestion('delete')}>Delete</button>}
                            </>
                    }

                    <DataPagination initialItems={hero.vehicles} setItems={setVehicles} label='Vehicles in hangar:' />
                    <div className='items half'>
                        {vehicles.map(el => 
                            <div onClick={() => setVehicle(el)} className='item card'>
                                {centum.shorter(el.title)}
                            </div>    
                        )}
                    </div>

                    {vehicle !== null &&
                        <>
                            <CloseIt onClick={() => setVehicle(null)} />

                            {vehicle.image !== '' && <ImageLook src={vehicle.image} className='photo_item' alt='vehicle photo' />}

                            <h2>{vehicle.title}</h2>

                            <div className='items small'>
                                <h4 className='pale'>Type: {vehicle.format}</h4>
                                <h4 className='pale'><b>{vehicle.experience}</b> exp.</h4>
                            </div>
                           
                            <h2>Earned {experience} exp. on vehicle</h2>
                            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                            <button onClick={onUpdateVehicle} className='light'>Update</button>
                        </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 

                    {hero.nickname === context.nickname ?
                            <>
                                <h2>New Artifact</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it..' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {ARTIFACT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <h4 className='pale'>Prevalence: <b>{prevalence}%</b></h4>
                                <input value={prevalence} onChange={e => setState({...state, prevalence: parseInt(e.target.value)})} type='range' step={1} />

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageArtifact('create')}>Create</button>
                            </>
                        :
                            <>
                                <h2>New Question</h2>
                            
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text..' />

                                <h4 className='pale'>Theme</h4>
                                <div className='items small'>
                                    {QUESTION_THEMES.map(el => <div onClick={() => setState({...state, theme: el})} className={el === theme ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <button onClick={() => onManageQuestion('create')}>Ask</button>
                            </>
                    }

                    <DataPagination initialItems={hero.artifacts} setItems={setArtifacts} label='Collection of Artifacts:' />
                    <div className='items half'>
                        {artifacts.map(el => 
                            <div onClick={() => setArtifact(el)} className='item panel'>
                                {centum.shorter(el.title)}
                                <p>{el.category}</p>
                            </div>    
                        )}
                    </div>

                    {artifact !== null &&
                        <>
                            <CloseIt onClick={() => setArtifact(null)} />
                        
                            {artifact.image !== '' && <ImageLook src={artifact.image} className='photo_item' alt='artifact photo' />}

                            <h2>{artifact.title}</h2>

                            <div className='items small'>
                                <h4 className='pale'>Type: {artifact.category}</h4>
                                <h4 className='pale'><b>{artifact.likes}</b> likes</h4>
                            </div>

                            {hero.nickname === context.nickname ? 
                                    <button onClick={() => onManageArtifact('delete')}>Delete</button>
                                :
                                    <button onClick={() => onManageArtifact('like')}>Like</button>
                            }
                        </>
                    }
                </>
            }

            {hero === null && <Loading loadLabel="Hero's" />}
        </>
    )
}

export default Hero