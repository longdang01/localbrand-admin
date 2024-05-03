import { Avatar, Divider, Menu, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { useSidebar } from '@/stores/sidebar.store';
import { useTranslation } from 'react-i18next';
import defaultAvatar from "@/assets/images/avatars/default.png";
import {
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useGetMe } from '@/loaders/auth.loader';
import UsersModalRender from '@/modules/users/information/UsersModalRender';
import { useState } from 'react';
import { BASE_URL } from '@/constants/config';
import ChangePasswordModalRender from '@/modules/users/change-password/ChangePasswordModalRender';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';
import { logout } from '@/services/user.service';

interface Props {
    vertical?: boolean;
}

const { useToken } = theme;

const MenuUsers = ({ vertical = true }: Props) => {
    const { t } = useTranslation('translation');
    const { token } = useToken();
    const navigate = useNavigate()
    const [openUsersModal, setOpenUsersModal] = useState<boolean>(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState<boolean>(false);

    const currentUsers = useGetMe({
    });
   
    const [collapsed] = useSidebar((state) => [state.collapsed]);

    const MENU_USERS = [
        {
            key: 1,
            type: 'divider',
            label: currentUsers?.isLoading ? (
                <div style={{ marginLeft: 20 }}>
                    <div className="dot-loader-sm"></div>
                </div>
            ) : (
                currentUsers?.data?.full_name
            ),
            icon: (!currentUsers?.isLoading || !currentUsers?.isFetching) &&
            (
                <Avatar
                    // src={(generateImage(`${BASE_URL}/${currentUsers?.data?.avatar_url}`) || defaultAvatar)}
                    src={currentUsers?.data?.avatar_url ? `${BASE_URL}/${currentUsers?.data?.avatar_url}` : defaultAvatar}
                    size={'small'}
                    shape="circle"
                    className={classes.avatar}
                />
            ), // avatar
            children: [
                {
                    key: 11,
                    label: t('users.profile'),
                    icon: <UserOutlined />,
                },
                {
                    key: 12,
                    label: t('users.change_password'),
                    icon: <SettingOutlined />,
                },
                {
                    key: 13,
                    label: t('users.logout'),
                    icon: <LogoutOutlined />,
                },
            ],
        },
    ];

    // handle change menu users 
    const handleChangeUsers = (e: any) => {
        switch (e?.key) {
            case "11":
                setOpenUsersModal(true); 
                break;
            case "12":
                setOpenChangePasswordModal(true); 
                break;
            case "13":
                handleLogout();
                break;
        }
    };

    // handle logout
    const handleLogout = async () => {
        await logout();
        localStorage.clear();
        
        setTimeout(() => {
            navigate(LOGIN_PATH);
        }, 300);
    }

    return (
        <>
            {/* Users Information */}
            <UsersModalRender open={openUsersModal} handleClose={() => {setOpenUsersModal(false);}}/>

            {/* Change Password */}
            <ChangePasswordModalRender open={openChangePasswordModal} handleClose={() => setOpenChangePasswordModal(false)}/>

            <div
                className={classes.user}
                style={{
                    background: token.colorBgContainer,
                }}
            >
                <Divider
                    style={{
                        margin: 0,
                        borderBlockStart: `1px solid ${token.colorBorder}`,
                    }}
                />
                <Menu
                    onClick={handleChangeUsers}
                    onOpenChange={handleChangeUsers}
                    mode={vertical ? 'vertical' : 'inline'}
                    items={MENU_USERS?.map((item) => ({
                        ...item,
                        children: [
                            ...item.children.slice(0, -1), // All children except the last one
                            { type: 'divider' }, // Divider object
                            item.children[item.children.length - 1], // Last child item
                        ],
                    }))}
                    className={collapsed ? classes.userCollapsed : ''}
                />
            </div>
        </>
    );
};

export default MenuUsers;
