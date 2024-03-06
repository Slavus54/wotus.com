import {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {SERVERS, NATIONS, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {createProfileM} from '../../graphql/profile/ProfileQueries'
import {TownType} from '../../types/types'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [image, setImage] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        nickname: '', 
        password: '', 
        telegram: '',
        server: SERVERS[0], 
        nation: NATIONS[0],
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {nickname, password, telegram, server, nation, region, cords} = state

    useEffect(() => {
        centum.title('Create an Account', PROJECT_TITLE)
    }, [])

    const [createProfile] = useMutation(createProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createProfile)
            change_context('update', data.createProfile, 1)
        }
    })

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

    const onCreate = () => {
        createProfile({
            variables: {
                nickname, password, telegram, server, nation, region, cords, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>What you name in game?</h4>
                        <input value={nickname} onChange={e => setState({...state, nickname: e.target.value})} placeholder='Nickname' type='text' />
                
                        <h4 className='pale'>Security</h4>
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />  
                        <ImageLoader setImage={setImage} />
                
                    </>,
                    <>
                        <h4 className='pale'>Connect to Telegram</h4>
                        <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Tag of profile' type='text' />

                        <h4 className='pale'>Game Server and Tank's Nation</h4>
                        <div className='items small'>
                            <select value={server} onChange={e => setState({...state, server: e.target.value})}>
                                {SERVERS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={nation} onChange={e => setState({...state, nation: e.target.value})}>
                                {NATIONS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>
                    </>,
                    <>
                        <h4 className='pale'>Where are you?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>New Account</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default Register