import React from 'react'
import {SessionDescriptionType} from '../../types/types'

const RaidCommonInfo: React.FC<SessionDescriptionType> = ({dateUp, time}) => {
    return (
        <div className='items small'>
            <h4 className='pale'>Date: {dateUp}</h4>
            <h4 className='pale'>Start in {time}</h4>
        </div>
    )
}

export default RaidCommonInfo