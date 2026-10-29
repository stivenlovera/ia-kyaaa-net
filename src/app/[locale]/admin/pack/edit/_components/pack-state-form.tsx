'use client'
import { useState } from 'react'
import { useRouter } from '@/src/i18n/navigation'
import { useAlert } from '@/src/providers/alertProvider'
import { IStatePack } from '@/src/app/types/state-pack.types'
import { IResponse } from '@/src/app/types/response'
import API from '@/src/providers/api'

interface PackStateFormProps {
    pack_id: number
    state_pack_id: number
    states: IStatePack[]
}

export const PackStateForm = ({ pack_id, state_pack_id, states }: PackStateFormProps) => {
    const router = useRouter()
    const { setAlert } = useAlert()
    const [value, setValue] = useState(state_pack_id)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const handleSave = async () => {
        setError(null)
        setIsPending(true)
        try {
            const { data } = await API.patch<IResponse<{ pack_id: number, state_pack_id: number }>>('/api/pack/state', { pack_id, state_pack_id: value })
            if (data.success) {
                setAlert({ open: true, icon: 'success', message: 'Estado del pack actualizado correctamente' })
                router.refresh()
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error del servidor')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className='flex flex-wrap items-end gap-3'>
            <div>
                <label htmlFor='state_pack_id' className='block text-xs font-medium mb-1'>Estado del pack</label>
                <select
                    id='state_pack_id'
                    value={value}
                    onChange={(e) => { setValue(Number(e.currentTarget.value)) }}
                    disabled={isPending}
                >
                    {states.map((s) => (
                        <option key={s.state_pack_id} value={s.state_pack_id}>{s.name}</option>
                    ))}
                </select>
            </div>
            <button
                className='btn-primary'
                type='button'
                onClick={handleSave}
                disabled={isPending || value === state_pack_id}
            >
                Guardar
            </button>
            {error && <p className='text-red-500 text-xs w-full'>{error}</p>}
        </div>
    )
}
