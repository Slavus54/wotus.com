import React, {useState, useEffect, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {TG_ICON, WG_ICON, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import Closeit from '../UI/CloseIt'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import MapPicker from '../UI/MapPicker'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getProfileM} from '../../graphql/pages/ProfilePageQueries'
import {manageProfileMissionM} from '../../graphql/profile/ProfileQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [profile, setProfile] = useState<any | null>(null)
    const [missions, setMissions] = useState<any[]>([])
    const [mission, setMission] = useState<any | null>(null)

    const centum = new Centum()

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileMission] = useMutation(manageProfileMissionM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageProfileMission)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (profile !== null) {
            setCords(profile.cords)         
            setImage(profile.main_photo === '' ? ProfilePhoto : profile.main_photo)
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onView = (key: string) => {
        if (key === 'telegram') {
            centum.go(profile.telegram, key)
        } else if (key === 'wot') {
            centum.go(`https://worldoftanks.eu/en/community/accounts/#wot&at_search=${profile.nickname}`)
        }
    }

    const onSupportMission = () => {
        manageProfileMission({
            variables: {
                account_id: id, option: 'support', title: '', category: '', volume: 0, status: '', image: '', dateUp: '', coll_id: mission.shortid
            }
        })
    }

    return (
        <>          
            {profile !== null && profile.account_id !== context.account_id &&
                <>
                    <ImageLook src={image} className='photo_item' alt='account photo' />
                    <h2>{profile.nickname}</h2>

                    <div className='items little'>
                        <div className='item'>
                            <ImageLook onClick={() => onView('telegram')} min={2} max={2} src={TG_ICON} className='icon' alt='icon' />
                            <p className='pale'>telegram</p>
                        </div>
                        <div className='item'>
                            <ImageLook onClick={() => onView('wot')} min={2} max={2} src={WG_ICON} className='icon' alt='icon' />
                            <p className='pale'>stats</p>
                        </div>                       
                    </div>  

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>  

                    {mission === null ? 
                            <>
                                <DataPagination initialItems={profile.missions} setItems={setMissions} label='List of Missions:' />
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
                                <Closeit onClick={() => setMission(null)} />

                                {mission.image !== '' && <ImageLook src={mission.image} className='photo_item' alt='mission photo' />}

                                <h2>{mission.title}</h2>
         
                                <div className='items small'>
                                    <h5>Every {mission.weekday} in {mission.time}</h5>   
                                    <h5>ID for platoon: {mission.shortid}</h5>
                                </div>

                                <div className='items small'>
                                    <h4 className='pale'><b>{mission.volume}K</b> {mission.category}</h4>   
                                    <h4 className='pale'>Status: {mission.status}</h4>
                                    <h4 className='pale'><b>{mission.supports}</b> supports</h4>
                                </div>                              
                               
                                <button onClick={onSupportMission}>Support</button>
                            </>
                    }
                </>
            }

            {profile === null && <Loading loadLabel="Profile's" />}
        </>
    )
}

export default Profile