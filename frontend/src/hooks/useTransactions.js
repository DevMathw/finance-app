import { useState, useEffect, useCallback } from 'react'
import { getTransactions, createTransaction, deleteTransaction, getSummary } from '../api/transactionApi'

export const useTransactions = (filters = {}) => {
  const [transactions, setTransactions] = useState([])
  const [summary,      setSummary]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [txRes, sumRes] = await Promise.all([getTransactions(filters), getSummary()])
      setTransactions(txRes.data || [])
      setSummary(sumRes.data     || null)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor.')
    } finally { setLoading(false) }
  }, [JSON.stringify(filters)]) // eslint-disable-line

  useEffect(() => { load() }, [load])

  const addTransaction = async (payload) => {
    const res = await createTransaction(payload)
    await load()
    return res
  }

  const removeTransaction = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTransaction(id)
      const sumRes = await getSummary()
      setSummary(sumRes.data || null)
    } catch { await load() }
  }

  return { transactions, summary, loading, error, addTransaction, removeTransaction, reload: load }
}