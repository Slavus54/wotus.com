import React, {useState, useEffect, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {HERO_TYPES, SEARCH_PERCENT, VIEW_CONFIG, PROJECT_TITLE, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import MapPicker from '../UI/MapPicker'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getHeroesQ} from '../../graphql/pages/HeroPageQueries'
import {TownType, Cords} from '../../types/types'

const Heroes: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [heroes, setHeroes] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [fullname, setFullname] = useState<string>('')
    const [category, setCategory] = useState<string>(HERO_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getHeroesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setHeroes(data.getHeroes)

            centum.title('Heroes', PROJECT_TITLE)
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
        if (heroes !== null) {
            let result: any[] = heroes.filter(el => el.region === region)

            if (fullname !== '') {
                result = result.filter(el => centum.search(el.fullname, fullname, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category)
            
            setFiltered(result)
        }
    }, [heroes, fullname, category, region])

    return (
        <>          
            <h1>Tankmen</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Fullname</h4>
                    <input value={fullname} onChange={e => setFullname(e.target.value)} placeholder='Person' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>
            
            <select value={category} onChange={e => setCategory(e.target.value)}>
                {HERO_TYPES.map(el => <option value={el}>{el}</option>)}
            </select> 
         
            <DataPagination initialItems={filtered} setItems={setFiltered} label='Heroes on Map:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/hero/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.fullname)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL>  
            }

            {loading && <Loading loadLabel='Heroes' />}
        </>
    )
}

export default Heroes