import { GetMenuItemFn, LevelKeysProps, MenuItem, NavigationItem } from '@/models/sidebar';
import React from 'react';


export const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null,
    type?: 'group',
): MenuItem => {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
};

export const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                return func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

// Recursive function to convert a NavigationItem to an array of MenuItem objects
export const convertToMenuItems = (
    items: NavigationItem[],
    getItem: GetMenuItemFn,
): MenuItem[] => {
    return items.map((item) => {
        const { label, key, icon, children } = item;

        // Convert children recursively
        const convertedChildren: MenuItem[] | null =
            children.length > 0 ? convertToMenuItems(children, getItem) : null;

        // Call getItem to construct MenuItem object
        return getItem(label, key.toString(), icon, convertedChildren);
    });
};

