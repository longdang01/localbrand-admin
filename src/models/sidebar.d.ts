export type MenuItem = Required<MenuProps>['items'][number];

export interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

export type NavigationItem = {
    key: number;
    label: string;
    icon: React.ReactNode | null;
    children: NavigationItem[];
};

export type GetMenuItemFn = (label: string, key: string, icon: React.ReactNode | null, children?: MenuItem[] | null) => MenuItem;
