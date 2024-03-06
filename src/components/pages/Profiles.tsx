import React, {useState, useEffect, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {SEARCH_PERCENT, VIEW_CONFIG, PROJECT_TITLE, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import MapPicker from '../UI/MapPicker'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getProfilesQ} from '../../graphql/pages/ProfilePageQueries'
import {TownType, Cords} from '../../types/types'

const Profiles: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [profiles, setProfiles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [nickname, setNickname] = useState<string>('')
    const [isSameServer, setIsSameServer] = useState<boolean>(true)
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getProfilesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProfiles(data.getProfiles)

            centum.title('Profiles', PROJECT_TITLE)
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (nickname !== '') {
                result = result.filter(el => centum.search(el.nickname, nickname, SEARCH_PERCENT))
            }

            if (isSameServer) {
                result = result.filter(el => el.server === context.server)
            }

            setFiltered(result)
        }
    }, [profiles, nickname, region, isSameServer])

    return (
        <>          
            <h1>New Friends</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Nickname</h4>
                    <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder='Name in game' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <div onClick={() => setIsSameServer(!isSameServer)} className='item pale'>Server: {isSameServer ? 'Same' : 'Any'}</div>           

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Players on Map:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                {centum.shorter(el.nickname)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL> 
            }

            {loading && <Loading loadLabel='Players' />}
        </>
    )
}

export default Profiles