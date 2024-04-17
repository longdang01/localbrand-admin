import { Divider, Menu, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { itemsUser } from '../../constants/sidebar.constants';
import { useSidebar } from '@/stores/sidebar.store';

interface Props {
    vertical?: boolean;
}
const { useToken } = theme;

const MenuUsers = ({ vertical = true }: Props) => {
    const { token } = useToken();
    const [collapsed,] = useSidebar((state) => [state.collapsed,])
    return (
        <>
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
                    style={
                        {
                            // borderRight: `1px solid ${token.colorBorder}`,
                        }
                    }
                    mode={vertical ? "vertical" : "inline"}
                    items={itemsUser?.map((item) => ({
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
