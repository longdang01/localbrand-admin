export type StaffProps = {
    _id: string;
    username: string;
    staffName: string;
    role: string;
    picture: string;
    phone: string;
    password: string;
    email: string;
    dob: string;
    createdAt: string;
    updatedAt: string;
    address: string;
    active: number;
    user: {
        _id: string;
        username: string;
        password: string;
        email: string;
        role: number;
        active: number;
        createdAt: string;
        updatedAt: string
    }
}