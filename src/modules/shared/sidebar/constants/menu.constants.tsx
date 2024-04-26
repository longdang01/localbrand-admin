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
