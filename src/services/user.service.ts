import { apiClient } from '@/lib/api';
import { ChangePasswordProps, UserLoginProps } from '@/models/auth';
import { UserProfile } from '@/models/users';

const prefix = 'user';

export const getMe = async () => {
    const response = await apiClient.get(`${prefix}/me`);
    return response.data;
};

export const login = async (data: UserLoginProps) => {
    const response = await apiClient?.post(`/login`, data);
    return response.data;
};

export const logout = async () => {
    const response = await apiClient?.delete(`/logout`);
    return response?.data;
}

export const changePassword = async (data: ChangePasswordProps) => {
    const response = await apiClient?.put(`/change-password`, data);
    return response.data;
};

export const updateProfile = async (data: UserProfile) => {
    const response = await apiClient?.put(`${prefix}/profile`, data);
    return response.data;
};



