import axiosClient from './axiosClient'

export const loginUser    = async ({ email, password })       => { const { data } = await axiosClient.post('/auth/login',    { email, password }); return data }
export const registerUser = async ({ name, email, password }) => { const { data } = await axiosClient.post('/auth/register', { name, email, password }); return data }