import React, {useState, useEffect, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {CHARACTERISTIC_TYPES, DETAIL_TYPES, CHARACTERISTIC_DEFAULT_VOLUME, TANK_EXP_LIMIT, INITIAL_PERCENT} from '../../env/env'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {getTankM, makeTankCharacteristicM, updateTankInfoM, manageTankDetailM} from '../../graphql/pages/TankPageQueries'
import {CollectionPropsType} from '../../types/types'

const Tank: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [image, setImage] = useState<string>('')
    const [tank, setTank] = useState<any | null>(null)
    const [characteristics, setCharacteristics] = useState<any[]>([])
    const [characteristic, setCharacteristic] = useState<any | null>(null)
    const [details, setDetails] = useState<any[]>([])
    const [detail, setDetail] = useState<any | null>(null)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        text: '',
        category: CHARACTERISTIC_TYPES[0],
        volume: CHARACTERISTIC_DEFAULT_VOLUME,
        title: '',
        format: DETAIL_TYPES[0],
        experience: 0,
        dateUp: datus.move()
    })

    const {text, category, volume, title, format, experience, dateUp} = state

    const [getTank] = useMutation(getTankM, {
        onCompleted(data) {
            setTank(data.getTank)
        }
    })

    const [makeTankCharacteristic] = useMutation(makeTankCharacteristicM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.makeTankCharacteristic)
        }
    })
    
    const [updateTankInfo] = useMutation(updateTankInfoM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateTankInfo)
        }
    })

    const [manageTankDetail] = useMutation(manageTankDetailM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.manageTankDetail)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getTank({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (tank !== null) {
            setPercent(centum.percent(tank.experience, TANK_EXP_LIMIT))
        }
    }, [tank])

    useMemo(() => {
        setState({...state, experience: centum.part(percent, TANK_EXP_LIMIT)})
    }, [percent])

    const onMakeCharacteristic = () => {
        makeTankCharacteristic({
            variables: {
                nickname: context.nickname, id, text, category, volume
            }
        })
    }

    const onUpdateInfo = () => {
        updateTankInfo({
            variables: {
                nickname: context.nickname, id, experience, dateUp
            }
        })
    }

    const onManageDetail = (option: string) => {
        manageTankDetail({
            variables: {
                nickname: context.nickname, id, option, title, format, image, coll_id: detail === null ? '' : detail.shortid
            }
        })
    }

    return (
        <>          
            {tank !== null &&
                <>
                    <h1>{tank.title}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Type: {tank.category}</h4>
                        <h4 className='pale'>Tier: {datus.convert(tank.level)}</h4>
                    </div>                   

                    {characteristic === null ? 
                            <>
                                <h2>New Characteristic</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {CHARACTERISTIC_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <input value={volume} onChange={e => setState({...state, volume: parseInt(e.target.value)})} placeholder='Volume' type='text' />

                                {isNaN(volume) ? 
                                        <button onClick={() => setState({...state, volume: CHARACTERISTIC_DEFAULT_VOLUME})}>Reset</button>
                                    :
                                        <button onClick={onMakeCharacteristic}>Offer</button>
                                }

                                <DataPagination initialItems={tank.characteristics} setItems={setCharacteristics} label='Characteristics:' />
                                <div className='items half'>
                                    {characteristics.map(el => 
                                        <div onClick={() => setCharacteristic(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p>from {el.name}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setCharacteristic(null)} />

                                <h2>{characteristic.category}'s Characteristic from {characteristic.name}</h2>
                                <h4 className='pale'>{characteristic.text}: <b>{characteristic.volume}</b></h4>
                            </>
                    }
                    
                    <h4 className='pale'>Cost of Experience: <b>{experience}K</b></h4>
                    <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                    <button onClick={onUpdateInfo} className='light'>Update</button>

                    {detail === null ?
                            <>
                                <h2>New Detail</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                    {DETAIL_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />
                       
                                <button onClick={() => onManageDetail('create')}>Publish</button>

                                <DataPagination initialItems={tank.details} setItems={setDetails} label='Details of Vehicle:' />
                                <div className='items half'>
                                    {details.map(el => 
                                        <div onClick={() => setDetail(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setDetail(null)} />

                                {detail.image !== '' && <ImageLook src={detail.image} className='photo_item' alt='detail photo' />}

                                <h2>{detail.title}</h2>
                            
                                <div className='items small'>
                                    <h4 className='pale'>Type: {detail.format}</h4>
                                    <h4 className='pale'><b>{detail.likes}</b> likes</h4>
                                </div>

                                {detail.name === context.nickname ?
                                        <button onClick={() => onManageDetail('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageDetail('like')}>Like</button>
                                }
                            </>
                    }
                </>
            }

            {tank === null && <Loading loadLabel="Tank's" />}
        </>
    )
}

export default Tank