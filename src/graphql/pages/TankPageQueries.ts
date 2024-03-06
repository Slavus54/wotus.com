import {gql} from '@apollo/client'

export const createTankM = gql`
    mutation createTank($nickname: String!, $id: String!, $title: String!, $category: String!, $nation: String!, $role: String!, $level: Float!, $experience: Float!, $dateUp: String!) {
        createTank(nickname: $nickname, id: $id, title: $title, category: $category, nation: $nation, role: $role, level: $level, experience: $experience, dateUp: $dateUp)
    }
`

export const getTanksQ = gql`
    query {
        getTanks {
            shortid
            nickname
            title
            category
            nation
            role
            level
            experience
            dateUp
            characteristics {
                shortid
                name
                text
                category
                volume
            }
            details {
                shortid
                name
                title
                format
                image
                likes
            }
        }
    }
`

export const getTankM = gql`
    mutation getTank($shortid: String!) {
        getTank(shortid: $shortid) {
            shortid
            nickname
            title
            category
            nation
            role
            level
            experience
            dateUp
            characteristics {
                shortid
                name
                text
                category
                volume
            }
            details {
                shortid
                name
                title
                format
                image
                likes
            }
        }
    }
`

export const makeTankCharacteristicM = gql`
    mutation makeTankCharacteristic($nickname: String!, $id: String!, $text: String!, $category: String!, $volume: Float!) {
        makeTankCharacteristic(nickname: $nickname, id: $id, text: $text, category: $category, volume: $volume) 
    }
`

export const updateTankInfoM = gql`
    mutation updateTankInfo($nickname: String!, $id: String!, $experience: Float!, $dateUp: String!) {
        updateTankInfo(nickname: $nickname, id: $id, experience: $experience, dateUp: $dateUp) 
    }
`

export const manageTankDetailM = gql`
    mutation manageTankDetail($nickname: String!, $id: String!, $option: String!, $title: String!, $format: String!, $image: String!, $coll_id: String!) {
        manageTankDetail(nickname: $nickname, id: $id, option: $option, title: $title, format: $format, image: $image, coll_id: $coll_id)
    }
`