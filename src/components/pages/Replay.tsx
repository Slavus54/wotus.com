import React, {useState, useEffect, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {GOLDA_TYPES, TANK_LEVEL_LIMIT, TANK_TYPES, RATIO_TYPES, BATTLE_RESULTS, BATTLE_TIME_LIMIT, INITIAL_PERCENT, GOLDEN_ICON, YT_ICON} from '../../env/env'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import CounterView from '../UI/CounterView'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getReplayM, manageReplayRecordM, updateReplayNominationM, makeReplaySituationM} from '../../graphql/pages/ReplayPageQueries'
import {CollectionPropsType} from '../../types/types'

const Replay: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [level, setLevel] = useState<number>(TANK_LEVEL_LIMIT / 2)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [points, setPoints] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    const [replay, setReplay] = useState<any | null>(null)
    const [nominations, setNominations] = useState<any[]>([])
    const [nomination, setNomination] = useState<any | null>(null)
    const [records, setRecords] = useState<any[]>([])
    const [record, setRecord] = useState<any | null>(null)
    const [situation, setSituation] = useState<any | null>(null)
    const [state, setState] = useState<any | null>({
        golda: GOLDA_TYPES[0],
        title: '',
        label: '',
        url: '',
        text: '',
        category: TANK_TYPES[0],
        ratio: RATIO_TYPES[0],
        time: '',
        exodus: BATTLE_RESULTS[0]
    }) 

    const centum = new Centum()
    const datus = new Datus()

    const {golda, title, label, url, text, category, ratio, time, exodus} = state

    const [getReplay] = useMutation(getReplayM, {
        onCompleted(data) {
            setReplay(data.getReplay)
        }
    })

    const [manageReplayRecord] = useMutation(manageReplayRecordM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageReplayRecord)
        }
    })

    const [updateReplayNomination] = useMutation(updateReplayNominationM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateReplayNomination)
        }
    })
    
    const [makeReplaySituation] = useMutation(makeReplaySituationM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.makeReplaySituation)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getReplay({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        setLevel(nomination === null ? TANK_LEVEL_LIMIT / 2 : nomination.level)
        setState({...state, label: nomination === null ? '' : nomination.label, golda: nomination === null ? GOLDA_TYPES[0] : nomination.golda})
    }, [nomination])

    useEffect(() => {
        let coof: number = centum.part(percent, BATTLE_TIME_LIMIT)
        let result: string = datus.time(coof * 60)

        setState({...state, time: result})
    }, [percent])

    useMemo(() => {
        if (situation === null) {
            setState({...state, exodus: BATTLE_RESULTS[0]})
        }
    }, [situation])

    const onView = () => {
        centum.go(record.url)
    }

    const onSituation = () => {
        if (situation === null) {
            let result = centum.random(replay.situations)?.value

            if (result !== undefined) {
                setSituation(result)
            }
        } else {

            if (situation.exodus === exodus) {
                setPoints(points + 1)
            }

            setSituation(null)
        }
    }

    const onUpdateNomination = () => {
        updateReplayNomination({
            variables: {
                nickname: context.nickname, id, golda, level
            }
        })
    }

    const onManageRecord = (option: string) => {
        manageReplayRecord({
            variables: {
                nickname: context.nickname, id, option, title, label, url, image, coll_id: record === null ? '' : record.shortid
            }
        })
    }

    const onMakeSituation = () => {
        makeReplaySituation({
            variables: {
                nickname: context.nickname, id, text, category, ratio, time, exodus
            }
        })
    }

    return (
        <>          
            {replay !== null &&
                <>
                    <h2>{replay.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Battle: {replay.category}</h4>
                        <h4 className='pale'>{replay.nation}'s tanks on {replay.server}</h4>
                    </div>

                    {nomination === null ? 
                            <>
                                <DataPagination initialItems={replay.nominations} setItems={setNominations} label='List of Nominations:' />
                                <div className='items half'>
                                    {nominations.map(el => 
                                        <div onClick={() => setNomination(el)} className='item panel'>
                                            {centum.shorter(el.label)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setNomination(null)} />

                                <h2>{nomination.label}</h2>

                                <ImageLook src={GOLDEN_ICON} min={2} max={2} className='icon' />

                                <select value={golda} onChange={e => setState({...state, golda: parseInt(e.target.value)})}>
                                    {GOLDA_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <CounterView num={level} setNum={setLevel} part={1} min={TANK_LEVEL_LIMIT / 2} max={TANK_LEVEL_LIMIT}>
                                    From {datus.convert(level)} tier
                                </CounterView> 

                                <button onClick={onUpdateNomination} className='light'>Update</button>

                                <h2>New Record</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <ImageLook src={YT_ICON} min={2} max={2} className='icon' />

                                <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='Video URL' type='text' />
                            
                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageRecord('create')}>Create</button>
                            </>
                    }

                    <DataPagination initialItems={replay.records} setItems={setRecords} label='Collections of Records:' />
                    <div className='items half'>
                        {records.map(el => 
                            <div onClick={() => setRecord(el)} className='item panel'>
                                {centum.shorter(el.title)}
                            </div>    
                        )}
                    </div>

                    {record !== null &&
                        <>
                            <CloseIt onClick={() => setRecord(null)} />

                            {record.image !== '' && <ImageLook src={record.image} className='photo_item' alt='record photo' />}

                            <h2>{record.title}</h2>
                            
                            <button onClick={onView} className='light'>Look</button>

                            <div className='items small'>
                                <h4 className='pale'>Nomination: {record.label}</h4>
                                <h4 className='pale'><b>{record.likes}</b> likes</h4>
                            </div>

                            {record.name === context.nickname ? 
                                    <button onClick={() => onManageRecord('delete')}>Delete</button>
                                :
                                    <button onClick={() => onManageRecord('like')}>Like</button>
                            }
                        </>
                    }

                    {situation === null ? 
                            <>
                                <h2>New Situation</h2>
                                <h4 className='pale'>Game Points: <b>{points}</b></h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text...' />

                                <h4 className='pale'>Battle's Exodus</h4>
                                <div className='items small'>
                                    {BATTLE_RESULTS.map(el => <div onClick={() => setState({...state, exodus: el})} className={el === exodus ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Tank's Type and Enemy Ratio ({ratio}:1)</h4>
                                <div className='items small'>
                                    <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                                        {TANK_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={ratio} onChange={e => setState({...state, ratio: parseInt(e.target.value)})}>
                                        {RATIO_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <h4 className='pale'>Battle's Time: {time}</h4>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <div className='items small'>
                                    <button onClick={onSituation}>Generate</button>
                                    <button onClick={onMakeSituation}>Publish</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setSituation(null)} />

                                <p className='text'>Situation: {situation.text} ({situation.time})</p>

                                <div className='items small'>
                                    <h4 className='pale'>Tank: {situation.category}</h4>
                                    <h4 className='pale'>Enemy: {situation.ratio}:1</h4>
                                </div>

                                <h4 className='pale'>Guess Battle's Exodus</h4>
                                <div className='items small'>
                                    {BATTLE_RESULTS.map(el => <div onClick={() => setState({...state, exodus: el})} className={el === exodus ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>
                            
                                <button onClick={onSituation}>Check</button>
                            </>
                    }
                </>
            }

            {replay === null && <Loading loadLabel="Replay's" />}
        </>
    )
}

export default Replay