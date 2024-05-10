import { apiClient } from '@/lib/api';
import { ChangePasswordProps, ForgotPasswordProps, ResetPasswordProps, UserLoginProps } from '@/models/auth';
import { UserProfile } from '@/models/users';

const prefix = 'users';

export const getMe = async () => {
    const response = await apiClient.get(`${prefix}/me`);
    return response.data;
};

export const login = async (request: UserLoginProps) => {
    const response = await apiClient?.post(`${prefix}/login`, request);
    return response.data;
};

export const logout = async () => {
    const response = await apiClient?.delete(`/logout`);
    return response?.data;
}

export const changePassword = async (request: ChangePasswordProps) => {
    const response = await apiClient?.post(`${prefix}/change-password`, request);
    return response.data;
};

export const updateProfile = async (request: UserProfile) => {
    const response = await apiClient?.put(`${prefix}/profile`, request);
    return response.data;
};

export const forgotPassword = async (request: ForgotPasswordProps) => {
    const response = await apiClient?.post(`${prefix}/forgot-password`, request);
    return response.data;
};

export const resetPassword = async (request: ResetPasswordProps) => {
    const response = await apiClient?.post(`${prefix}/reset-password`, request);
    return response.data;
};



