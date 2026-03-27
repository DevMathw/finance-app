import axiosClient from './axiosClient'

export const getTransactions    = async (filters = {}) => { const { data } = await axiosClient.get('/transactions', { params: filters }); return data }
export const createTransaction  = async (payload)      => { const { data } = await axiosClient.post('/transactions', payload); return data }
export const deleteTransaction  = async (id)           => { const { data } = await axiosClient.delete(`/transactions/${id}`); return data }
export const getSummary         = async ()             => { const { data } = await axiosClient.get('/transactions/summary'); return data }