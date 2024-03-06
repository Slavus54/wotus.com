import {gql} from '@apollo/client'

export const createSessionM = gql`
    mutation createSession($nickname: String!, $id: String!, $title: String!, $category: String!, $server: String!, $nation: String!, $levels: [Float]!, $discord: String!, $dateUp: String!, $time: String!, $technic: String!) {
        createSession(nickname: $nickname, id: $id, title: $title, category: $category, server: $server, nation: $nation, levels: $levels, discord: $discord, dateUp: $dateUp, time: $time, technic: $technic)
    }
`

export const getSessionsQ = gql`
    query {
        getSessions {
            shortid
            nickname
            title
            category
            server
            nation
            levels
            discord
            dateUp
            time
            members {
                account_id
                nickname
                technic
            }
            platoons {
                shortid
                name
                text
                format
                level
                duration
                status
                players
            }
            awards {
                shortid
                name
                title
                category
                image
                timestamp
                likes
            }
        }
    }
`

export const getSessionM = gql`
    mutation getSession($shortid: String!) {
        getSession(shortid: $shortid) {
            shortid
            nickname
            title
            category
            server
            nation
            levels
            discord
            dateUp
            time
            members {
                account_id
                nickname
                technic
            }
            platoons {
                shortid
                name
                text
                format
                level
                duration
                status
                players
            }
            awards {
                shortid
                name
                title
                category
                image
                timestamp
                likes
            }
        }
    }
`

export const manageSessionStatusM = gql`
    mutation manageSessionStatus($nickname: String!, $id: String!, $option: String!, $technic: String!) {
        manageSessionStatus(nickname: $nickname, id: $id, option: $option, technic: $technic)
    }
`

export const manageSessionPlatoonM = gql`
    mutation manageSessionPlatoon($nickname: String!, $id: String!, $option: String!, $text: String!, $format: String!, $level: String!, $duration: Float!, $status: String!, $coll_id: String!) {
        manageSessionPlatoon(nickname: $nickname, id: $id, option: $option, text: $text, format: $format, level: $level, duration: $duration, status: $status, coll_id: $coll_id)
    }
`

export const manageSessionAwardM = gql`
    mutation manageSessionAward($nickname: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $timestamp: String!, $coll_id: String!) {
        manageSessionAward(nickname: $nickname, id: $id, option: $option, title: $title, category: $category, image: $image, timestamp: $timestamp, coll_id: $coll_id)
    }
`