import { UserProps } from "./users";

export type StaffProps = {
    _id: string;
    user: string | UserProps;
    staffName: string;
    picture: string;
    phone: string;
    dob: string;
    address: string;

    active: number;
    createdAt: string;
    updatedAt: string;
}