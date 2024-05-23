export type UserProfile = {
    full_name: string;
    avatar_url: string;
}

export type UserProps = {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: number;
    active: number;
    createdAt: string;
    updatedAt: string
}