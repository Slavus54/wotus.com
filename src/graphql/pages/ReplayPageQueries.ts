import {gql} from '@apollo/client'

export const createReplayM = gql`
    mutation createReplay($nickname: String!, $id: String!, $title: String!, $category: String!, $server: String!, $nation: String!, $nominations: [INomination]!) {
        createReplay(nickname: $nickname, id: $id, title: $title, category: $category, server: $server, nation: $nation, nominations: $nominations)
    }
`

export const getReplaysQ = gql`
    query {
        getReplays {
            shortid
            nickname
            title
            category
            server
            nation
            nominations {
                id
                label
                golda
                level
            }
            records {
                shortid
                name
                title
                label
                url
                image
                likes
            }
            situations {
                shortid
                name
                text
                category
                ratio
                time
                exodus
            }
        }
    }
`

export const getReplayM = gql`
    mutation getReplay($shortid: String!) {
        getReplay(shortid: $shortid) {
            shortid
            nickname
            title
            category
            server
            nation
            nominations {
                id
                label
                golda
                level
            }
            records {
                shortid
                name
                title
                label
                url
                image
                likes
            }
            situations {
                shortid
                name
                text
                category
                ratio
                time
                exodus
            }
        }
    }
`

export const manageReplayRecordM = gql`
    mutation manageReplayRecord($nickname: String!, $id: String!, $option: String!, $title: String!, $label: String!, $url: String!, $image: String!, $coll_id: String!) {
        manageReplayRecord(nickname: $nickname, id: $id, option: $option, title: $title, label: $label, url: $url, image: $image, coll_id: $coll_id)
    }
`

export const updateReplayNominationM = gql`
    mutation updateReplayNomination($nickname: String!, $id: String!, $golda: Float!, $level: Float!) {
        updateReplayNomination(nickname: $nickname, id: $id, golda: $golda, level: $level)
    }
`

export const makeReplaySituationM = gql`
    mutation makeReplaySituation($nickname: String!, $id: String!, $text: String!, $category: String!, $ratio: Float!, $time: String!, $exodus: String!) {
        makeReplaySituation(nickname: $nickname, id: $id, text: $text, category: $category, ratio: $ratio, time: $time, exodus: $exodus)
    }
`