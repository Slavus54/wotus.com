import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CreateTank from '../pages/CreateTank'
import Tanks from '../pages/Tanks'
import Tank from '../pages/Tank'
import CreateSession from '../pages/CreateSession'
import Sessions from '../pages/Sessions'
import Session from '../pages/Session'
import CreateHero from '../pages/CreateHero'
import Heroes from '../pages/Heroes'
import Hero from '../pages/Hero'
import CreateArea from '../pages/CreateArea'
import Areas from '../pages/Areas'
import Area from '../pages/Area'
import CreateReplay from '../pages/CreateReplay'
import Replays from '../pages/Replays'
import Replay from '../pages/Replay'
import Profiles from '../pages/Profiles'
import Profile from '../pages/Profile'

import {RouteType} from '../../types/types'

export const routes: RouteType[] = [
    {
        title: 'Home',
        access_value: 0,
        url: '/',
        component: Home,
        isVisible: true
    },
    {
        title: 'Account',
        access_value: -1,
        url: '/login',
        component: Login,
        isVisible: true
    },
    {
        title: 'Tanks',
        access_value: 1,
        url: '/tanks',
        component: Tanks,
        isVisible: true
    },
    {
        title: 'Sessions',
        access_value: 1,
        url: '/sessions',
        component: Sessions,
        isVisible: true
    },
    {
        title: 'Heroes',
        access_value: 1,
        url: '/heroes',
        component: Heroes,
        isVisible: true
    },
    {
        title: 'Areas',
        access_value: 1,
        url: '/areas',
        component: Areas,
        isVisible: true
    },
    {
        title: 'Replays',
        access_value: 1,
        url: '/replays',
        component: Replays,
        isVisible: true
    },
    {
        title: 'Profiles',
        access_value: 1,
        url: '/profiles',
        component: Profiles,
        isVisible: true
    },
    {
        title: '',
        access_value: -1,
        url: '/register',
        component: Register,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-tank/:id',
        component: CreateTank,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/tank/:id',
        component: Tank,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-session/:id',
        component: CreateSession,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/session/:id',
        component: Session,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-hero/:id',
        component: CreateHero,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/hero/:id',
        component: Hero,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-area/:id',
        component: CreateArea,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/area/:id',
        component: Area,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-replay/:id',
        component: CreateReplay,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/replay/:id',
        component: Replay,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/profile/:id',
        component: Profile,
        isVisible: false
    },
]