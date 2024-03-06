import {gql} from '@apollo/client'

export const createHeroM = gql`
    mutation createHero($nickname: String!, $id: String!, $fullname: String!, $category: String!, $rank: String!, $vehicles: [IVehicle]!, $region: String!, $cords: ICord!) {
        createHero(nickname: $nickname, id: $id, fullname: $fullname, category: $category, rank: $rank, vehicles: $vehicles, region: $region, cords: $cords)
    }
`

export const getHeroesQ = gql`
    query {
        getHeroes {
            shortid
            nickname
            fullname
            category
            rank
            vehicles {
                id
                title
                format
                image
                experience
            }
            region
            cords {
                lat
                long
            }
            artifacts {
                shortid
                title
                category
                prevalence
                image
                likes
            }
            questions {
                shortid
                name
                text
                theme
                reply
                answered
            }
        }
    }
`

export const getHeroM = gql`
    mutation getHero($shortid: String!) {
        getHero(shortid: $shortid) {
            shortid
            nickname
            fullname
            category
            rank
            vehicles {
                id
                title
                format
                image
                experience
            }
            region
            cords {
                lat
                long
            }
            artifacts {
                shortid
                title
                category
                prevalence
                image
                likes
            }
            questions {
                shortid
                name
                text
                theme
                reply
                answered
            }
        }
    }
`
export const manageHeroArtifactM = gql`
    mutation manageHeroArtifact($nickname: String!, $id: String!, $option: String!, $title: String!, $category: String!, $prevalence: Float!, $image: String!, $coll_id: String!) {
        manageHeroArtifact(nickname: $nickname, id: $id, option: $option, title: $title, category: $category, prevalence: $prevalence, image: $image, coll_id: $coll_id)
    }
`

export const updateHeroVehicleM = gql`
    mutation updateHeroVehicle($nickname: String!, $id: String!, $coll_id: String!, $experience: Float!) {
        updateHeroVehicle(nickname: $nickname, id: $id, coll_id: $coll_id, experience: $experience)
    }
`

export const manageHeroQuestionM = gql`
    mutation manageHeroQuestion($nickname: String!, $id: String!, $option: String!, $text: String!, $theme: String!, $reply: String!, $coll_id: String!) {
        manageHeroQuestion(nickname: $nickname, id: $id, option: $option, text: $text, theme: $theme, reply: $reply, coll_id: $coll_id)
    }
`