export type UserLoginProps = {
    user: {
        username: string;
        password: string;
    },
    page: number
}

export type ChangePasswordProps = {
    username: string;
    password: string;
    password_new: string;    
}

export type ForgotPasswordProps = {
    email: string;
}

export type ResetPasswordProps = {
    id: string;
    token: string;
    newPassword: string;
}