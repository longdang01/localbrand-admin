import {
    AppstoreAddOutlined,
    ClockCircleOutlined,
    FolderOpenOutlined,
    HomeOutlined,
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import avatar from '@/assets/images/avatars/avatar.jpg';
import Avatar from 'antd/es/avatar/avatar';
import classes from "../sidebar.module.scss";
import { t } from 'i18next';

export const DEFAULT_USER:any = { 
    data: {
        "profile_id": "73e50f1d-47b5-4a8f-9e80-ee1a4e526c7c",
        "user_id": "7668c489-72c0-4a6c-8d23-86f9b5d0e078",
        "first_name": "Long",
        "middle_name": "",
        "last_name": "Đặng",
        "full_name": "Long Đặng",
        "avatar": "",
        "gender": 1,
        "date_of_birth": "2001-07-24",
        "email": "danglong2407@gmail.com",
        "phone_number": "0971603963",
        "user_name": "longdh",
        "password": "$2b$12$iHw4yMr3UB3nBkscqEKDY.f.NKVTje8Q6scgv7M9mtlka.h4ji0lq",
        "online_flag": 1,
        "description": "",
        "role_id": "a2e6d075-7b08-4a79-8379-606f5d853245"
    }
}

export const MENU = [
    {
        key: 1,
        label: 'Home',
        icon: <HomeOutlined />,
        children: [],
    },
    {
        key: 2,
        label: 'My Library',
        icon: <FolderOpenOutlined />,
        children: [
            {
                key: 21,
                label: 'Project',
                icon: null,
                children: [],
            },
            {
                key: 22,
                label: 'Draft',
                icon: null,
                children: [],
            },
            {
                key: 23,
                label: 'Templates',
                icon: null,
                children: [],
            },
        ],
    },
    {
        key: 3,
        label: 'History',
        icon: <ClockCircleOutlined />,
        children: [],
    },
    {
        key: 4,
        label: 'Apps',
        icon: <AppstoreAddOutlined />,
        children: [
            {
                key: 41,
                label: 'Browse',
                icon: null,
                children: [],
            },
            {
                key: 42,
                label: 'Your Apps',
                icon: null,
                children: [],
            },
        ],
    },
    {
        key: 5,
        label: 'Settings',
        icon: <SettingOutlined />,
        children: [],
    }
];

export const MENU_USERS = [
    {
        key: 1,
        type: "divider",
        label: 'Long Dang', // username or name
        icon: (
            <Avatar src={avatar} size={'small'} shape="circle" className={classes.avatar}/>
        ), // avatar
        children: [
            {
                key: 11,
                label: t("users.profile"),
                icon: <UserOutlined />,
                children: [],
            },
            {
                key: 12,
                label: 'Settings',
                icon: <SettingOutlined />,
                children: [],
            },
            {
                key: 13,
                label: 'Logout',
                icon: <LogoutOutlined />,
                children: [],
            },
        ],
    },
];
