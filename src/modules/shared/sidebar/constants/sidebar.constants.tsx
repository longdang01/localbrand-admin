import { LevelKeysProps, MenuItem } from "@/models/sidebar";
import { convertToMenuItems, getItem, getLevelKeys } from "../utils/generate-menu";
import { MENU, MENU_USERS } from "./menu.constants";

export const items:MenuItem[] = convertToMenuItems(MENU, getItem);

export const itemsUser:MenuItem[] = convertToMenuItems(MENU_USERS, getItem);

export const levelKeys = getLevelKeys(items as LevelKeysProps[]);