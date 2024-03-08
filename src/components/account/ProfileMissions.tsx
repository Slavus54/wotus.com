import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {Datus, weekdays_titles, time_format_min_border, time_format_max_border} from 'datus.js'
import Centum from 'centum.js'
import {MISSION_TYPES, MISSION_STATUSES, MISSION_DEFAULT_VOLUME} from '../../env/env'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import CounterView from '../UI/CounterView'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {manageProfileMissionM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileMissions = ({profile, context}: AccountPageComponentProps) => {
    const [missions, setMissions] = useState<any[]>([])
    const [mission, setMission] = useState<any | null>(null)
    const [timer, setTimer] = useState<number>(time_format_max_border / 2)
    const [average, setAverage] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const datus = new Datus()
    
    const [state, setState] = useState({
        title: '', 
        category: MISSION_TYPES[0],
        volume: MISSION_DEFAULT_VOLUME,
        time: '', 
        weekday: weekdays_titles[0],
        status: MISSION_STATUSES[0]
    })

    const centum = new Centum()

    const {title, category, volume, time, weekday, status} = state

    const [manageProfileMission] = useMutation(manageProfileMissionM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageProfileMission)
        }
    })

    useMemo(() => {
        setImage(mission === null ? '' : mission.image)
        setState({...state, status: mission === null ? MISSION_STATUSES[0] : mission.status})
    }, [mission])

    useMemo(() => {
        let filtered = profile.missions.filter(el => el.category === category).map(el => el.volume)
        let result: number = centum.average(filtered)

        setAverage(result)
    }, [category])

    useMemo(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])

    const onManageMission = (option: string) => {
        manageProfileMission({
            variables: {
                account_id: context.account_id, option, title, category, volume, time, weekday, status, image, coll_id: mission === null ? '' : mission.shortid
            }
        })
    }
    
    return (
        <>
            {mission === null ? 
                    <>
                        <h2>New Mission</h2>

                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Earn 5K exp. for T-34-85' />
                        <div className='items small'>
                            {MISSION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <CounterView num={timer} setNum={setTimer} part={30} min={time_format_max_border / 2} max={time_format_max_border}>
                            Start in {time}
                        </CounterView>

                        <h4 className='pale'>Volume in thousands</h4>
                        <input value={volume} onChange={e => setState({...state, volume: parseInt(e.target.value)})} placeholder='Volume' type='text' />

                        <div className='items small'>
                            <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                                {weekdays_titles.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {MISSION_STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <ImageLoader setImage={setImage} />

                        {isNaN(volume) ? 
                                <button onClick={() => setState({...state, volume: MISSION_DEFAULT_VOLUME})} className='light'>Reset</button>
                            :
                                <button onClick={() => onManageMission('create')}>+</button>
                        }
    
                        <DataPagination initialItems={profile.missions} setItems={setMissions} label='List of missions:' />
                        <div className='items half'>
                            {missions.map(el => 
                                <div onClick={() => setMission(el)} className='item panel'>
                                    {centum.shorter(el.title)}
                                    <p>{el.dateUp}</p>
                                </div>    
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setMission(null)} />

                        {image !== '' && <ImageLook src={image} className='photo_item' alt='mission photo' />}

                        <h2>{mission.title}</h2>

                        <h4 className='pale'><b>{mission.volume}K</b> {mission.category} (average - <b>{average}K</b>)</h4>
                        
                        <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                            {MISSION_STATUSES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        <div className='items small'>
                            <button onClick={() => onManageMission('delete')}>Delete</button>
                            <button onClick={() => onManageMission('update')}>Update</button>
                        </div>
                    </>
            }
        </> 
    )
}

export default ProfileMissions