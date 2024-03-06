import React, {useState, useEffect, useMemo, useContext} from 'react'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {TANK_TYPES, TANK_LEVEL_LIMIT, SEARCH_PERCENT, PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import CounterView from '../UI/CounterView'
import DataPagination from '../UI/DataPagination'
import {getTanksQ} from '../../graphql/pages/TankPageQueries'

const Tanks: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [tanks, setTanks] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(TANK_TYPES[0])
    const [level, setLevel] = useState<number>(TANK_LEVEL_LIMIT / 2)

    const centum = new Centum()
    const datus = new Datus()

    const {data, loading} = useQuery(getTanksQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setTanks(data.getTanks)

            centum.title('Tanks', PROJECT_TITLE)
        }
    }, [data])

    useMemo(() => {
        if (tanks !== null) {
            let result: any[] = tanks.filter(el => el.category === category && el.level === level)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            setFiltered(result)
        }
    }, [tanks, title, category, level])

    return (
        <>          
            <h1>Vehicles for WoT</h1>

            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Enter title' type='text' />
    
            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {TANK_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>
        
            <CounterView num={level} setNum={setLevel} part={1} min={1} max={TANK_LEVEL_LIMIT}>
                Tier: {datus.convert(level)}
            </CounterView>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Collections of Tanks:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/tank/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                                <p>{el.nation}</p>
                            </NavigatorWrapper>
                        </div>    
                    )}
                </div>
            }

            {loading && <Loading loadLabel='Tanks' />}
        </>
    )
}

export default Tanks