import React, {useState, useEffect, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {TANK_TYPES, BATTLE_TYPES, PLATOON_STATUSES, AWARD_TYPES, INITIAL_PERCENT} from '../../env/env'
import {Context} from '../../context/WebProvider'
import SessionDescription from '../pieces/SessionDescription'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getSessionM, manageSessionStatusM, manageSessionPlatoonM, manageSessionAwardM} from '../../graphql/pages/SessionPageQueries'
import {CollectionPropsType} from '../../types/types'

const Session: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [isPlatoonCanBeJoined, setIsPlatoonCanBeJoined] = useState<boolean>(true)
    const [image, setImage] = useState<string>('')
    const [session, setSession] = useState<any | null>(null)
    const [personality, setPersonality] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [platoons, setPlatoons] = useState<any[]>([])
    const [platoon, setPlatoon] = useState<any | null>(null)
    const [awards, setAwards] = useState<any[]>([])
    const [award, setAward] = useState<any | null>(null)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        technic: TANK_TYPES[0],
        text: '',
        format: BATTLE_TYPES[0],
        level: '',
        duration: INITIAL_PERCENT,
        status: PLATOON_STATUSES[0],
        title: '',
        category: AWARD_TYPES[0],
        timestamp: datus.timestamp()
    })

    const {technic, text, format, level, duration, status, title, category, timestamp} = state

    const [getSession] = useMutation(getSessionM, {
        onCompleted(data) {
            setSession(data.getSession)
        } 
    })

    const [manageSessionStatus] = useMutation(manageSessionStatusM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageSessionStatus)
        } 
    })

    const [manageSessionPlatoon] = useMutation(manageSessionPlatoonM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageSessionPlatoon)
        } 
    })

    const [manageSessionAward] = useMutation(manageSessionAwardM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageSessionAward)
        } 
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getSession({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (session !== null) {
            let member = session.members.find(el => centum.search(el.account_id, context.account_id, 100))

            if (member !== undefined) {
                setPersonality(member)
            }

            setState({...state, level: session.levels[0]})
        }
    }, [session])

    useMemo(() => {
        if (personality !== null) {
            setState({...state, technic: personality.technic})
        }
    }, [personality])

    useMemo(() => {
        if (platoon !== null) {
            let flag: boolean = platoon.players.find(el => el === context.nickname) === undefined  
            
            flag = platoon.name !== context.nickname
        
            setIsPlatoonCanBeJoined(flag)
        }
    }, [platoon])

    const onViewStats = (nickname: string) => {
        centum.go(`https://worldoftanks.eu/en/community/accounts/#wot&at_search=${nickname}`)
    }

    const onManageStatus = (option: string) => {
        manageSessionStatus({
            variables: {
                nickname: context.nickname, id, option, technic
            }
        })
    } 

    const onManagePlatoon = (option: string) => {
        manageSessionPlatoon({
            variables: {
                nickname: context.nickname, id, option, text, format, level, duration, status, coll_id: platoon === null ? '' : platoon.shortid
            }
        })
    } 

    const onManageAward = (option: string) => {
        manageSessionAward({
            variables: {
                nickname: context.nickname, id, option, title, category, image, timestamp, coll_id: award === null ? '' : award.shortid
            }
        })
    } 

    return (
        <>         
            {session !== null && personality === null &&
                <>
                    <h2>Welcome to {session.title}!</h2>
                    <SessionDescription dateUp={session.dateUp} time={session.time} />

                    <h4 className='pale'>Own Technic's Type</h4>
                    <select value={technic} onChange={e => setState({...state, technic: e.target.value})}>
                        {TANK_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('join')}>Join</button>
                </>
            }

            {session !== null && personality !== null &&
                <>
                    <h2>{session.title}</h2>
                
                    <SessionDescription dateUp={session.dateUp} time={session.time} />
           
                    <h4 className='pale'>Tank's Nation - {session.nation}, there are {session.levels.length} Tiers to play on {session.server}</h4>

                    <button onClick={() => onManageStatus('exit')}>Leave</button>
                
                    {platoon === null ? 
                            <>
                                <h2>New Platoon</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text...' />

                                <h4 className='pale'>Battle's Type and Tank's Tier</h4>
                                <div className='items small'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {BATTLE_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={level} onChange={e => setState({...state, level: datus.convert(e.target.value)})}>
                                        {session.levels.map(el => <option value={el}>{datus.convert(el)}</option>)}
                                    </select>
                                </div>

                                <h4 className='pale'>Duration: <b>{duration}</b> minutes</h4>
                                <input value={duration} onChange={e => setState({...state, duration: parseInt(e.target.value)})} type='range' step={5} />

                                <button onClick={() => onManagePlatoon('create')}>Create</button>

                                <DataPagination initialItems={session.platoons} setItems={setPlatoons} label='List of Platoons:' />
                                <div className='items half'>
                                    {platoons.map(el => 
                                        <div onClick={() => setPlatoon(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p>{el.format}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPlatoon(null)} />

                                <h2>{platoon.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Battle: {platoon.format}</h4>
                                    <h4 className='pale'>Tier: {platoon.level}</h4>
                                    <h4 className='pale'>Duration: {datus.time(platoon.duration)}</h4>
                                </div>

                                <h4 className='pale'>List of Players</h4>
                                <div className='items small'>
                                    {platoon.players.map(el => <div onClick={() => onViewStats(el)} className='item label'>{el}</div>)}
                                </div>

                                {isPlatoonCanBeJoined ? <button onClick={() => onManagePlatoon('join')}>Join</button> : <h4 className='pale'>Already joined</h4>}

                                {platoon.name === context.nickname &&
                                    <>
                                        <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                            {PLATOON_STATUSES.map(el => <option value={el}>{el}</option>)}
                                        </select>

                                        <div className='items small'>   
                                            <button onClick={() => onManagePlatoon('delete')}>Delete</button>
                                            <button onClick={() => onManagePlatoon('update')}>Update</button>
                                        </div>
                                    </>
                                }
                            </>
                    }

                    <h4 className='pale'>Own Technic's Type</h4>
                    <select value={technic} onChange={e => setState({...state, technic: e.target.value})}>
                        {TANK_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('update')} className='light'>Update</button>

                    {award === null ? 
                            <>
                                <h3>Own Award</h3>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {AWARD_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>
                            
                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageAward('create')}>Publish</button>

                                <DataPagination initialItems={session.awards} setItems={setAwards} label='Gallery of Awards:' />
                                <div className='items half'>
                                    {awards.map(el => 
                                        <div onClick={() => setAward(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p>{el.timestamp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setAward(null)} />

                                {award.image !== '' && <ImageLook src={award.image} className='photo_item' alt='award photo' />}

                                <h2>{award.title} from {award.name}</h2>
                                
                                <div className='items small'>
                                    <h4 className='pale'>Type: {award.category}</h4>
                                    <h4 className='pale'><b>{award.likes}</b> likes</h4>
                                </div>

                                {award.name === context.nickname ? 
                                        <button onClick={() => onManageAward('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageAward('like')}>Like</button>
                                }
                            </>
                    }

                    <DataPagination initialItems={session.members} setItems={setMembers} label='Members:' />
                    <div className='items half'>
                        {members.map(el => 
                            <div className='item panel'>
                                <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                    {centum.shorter(el.nickname)}
                                </NavigatorWrapper>
                            </div>    
                        )}
                    </div>
                </>
            }

            {session === null && <Loading loadLabel="Session's" />}
        </>
    )
}

export default Session