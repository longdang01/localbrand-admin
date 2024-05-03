export type UserLoginProps = {
    username: string;
    password: string;
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
    new_password: string;
    new_confirm_password: string;
    username: string;
    token: string;
}