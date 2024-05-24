export type MenuItem = Required<MenuProps>['items'][number];

export interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

export type NavigationItem = {
    key: number | string;
    label: string;
    icon: React.ReactNode | null;
    children: NavigationItem[];
    url?: string;
    roles?: (string | number)[];
};

export type GetMenuItemFn = (label: string, key: string, icon: React.ReactNode | null, children?: MenuItem[] | null) => MenuItem;
