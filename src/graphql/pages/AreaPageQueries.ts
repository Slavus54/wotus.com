import {gql} from '@apollo/client'

export const createAreaM = gql`
    mutation createArea($nickname: String!, $id: String!, $title: String!, $category: String!, $mode: String!, $size: Float!, $region: String!, $cords: ICord!, $tier: Float!, $duration: Float!) {
        createArea(nickname: $nickname, id: $id, title: $title, category: $category, mode: $mode, size: $size, region: $region, cords: $cords, tier: $tier, duration: $duration) 
    }
`

export const getAreasQ = gql`
    query {
        getAreas {
            shortid
            nickname
            title
            category
            mode
            size
            region
            cords {
                lat
                long
            }
            tier
            duration
            locations {
                shortid
                name
                title
                category
                position
                cords {
                    lat
                    long
                }
                image
                likes
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const getAreaM = gql`
    mutation getArea($shortid: String!) {
        getArea(shortid: $shortid) {
            shortid
            nickname
            title
            category
            mode
            size
            region
            cords {
                lat
                long
            }
            tier
            duration
            locations {
                shortid
                name
                title
                category
                position
                cords {
                    lat
                    long
                }
                image
                likes
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const manageAreaLocationM = gql`
    mutation manageAreaLocation($nickname: String!, $id: String!, $option: String!, $title: String!, $category: String!, $position: String!, $cords: ICord!, $image: String!, $coll_id: String!) {
        manageAreaLocation(nickname: $nickname, id: $id, option: $option, title: $title, category: $category, position: $position, cords: $cords, image: $image, coll_id: $coll_id)
    }
`

export const updateAreaSettingsM = gql`
    mutation updateAreaSettings($nickname: String!, $id: String!, $tier: Float!, $duration: Float!) {
        updateAreaSettings(nickname: $nickname, id: $id, tier: $tier, duration: $duration)
    }
`

export const makeAreaFactM = gql`
    mutation makeAreaFact($nickname: String!, $id: String!, $text: String!, $level: String!, $isTrue: Boolean!) {
        makeAreaFact(nickname: $nickname, id: $id, text: $text, level: $level, isTrue: $isTrue)
    }
`