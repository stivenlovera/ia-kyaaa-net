"use client"

import { useAuth } from "@/src/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { IFormLogin, initialStateFormLogin } from "../../_types/user.type";
import { actionFormLogin } from "../../actions/actionFormLogin";
import Form from "next/form";
import Link from "next/link";

export const FormLogin = () => {

    const router = useRouter();
    const { checkAuth } = useAuth()

    const action = async (prevState: IFormLogin, formData: FormData) => {
        const result = await actionFormLogin(prevState, formData)
        if (result.success) {
            checkAuth()
            router.push('/')
        }
        return result;
    }

    const [state, formAction, isPending] = useActionState(action, initialStateFormLogin);

    return (

        <Form
            className='p-2'
            action={formAction}
        >
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-xs font-medium mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        className='w-full bg-amber-50 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
                        placeholder='Email'
                        type="email"
                        name="email"
                        autoComplete="off"
                        defaultValue={state?.fields?.email}
                    />
                    {state?.errors?.email && <p className="text-red-500 text-xs pt-1">{state.errors.email}</p>}
                </div>
                <div>
                    <label
                        htmlFor="contraseña"
                        className="block text-xs font-medium mb-1">
                        Contraseña
                    </label>
                    <input
                        id="contraseña"
                        className='w-full bg-amber-50 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
                        placeholder='Contraseña'
                        type="password"
                        name="password"
                        autoComplete="off"
                        defaultValue={state?.fields?.password}
                    />
                    {state?.errors?.password && <p className="text-red-500 text-xs pt-1">{state.errors.password}</p>}
                </div>
                <div className="text-sm">
                    ¿Olvidaste tu contraseña?, haz click
                    <Link href={'forgot-password'} className="underline text-blue-600"><b>aquí</b></Link>.
                </div>
            </div>
            <div className='text-center pt-4'>
                <button
                    className='btn-primary p-2'
                    type="submit"
                    disabled={isPending}
                >
                    <div className='flex flex-row'>
                        <p className='px-2'>{isPending ? '...' : 'Inicia sesion'}</p>
                    </div>
                </button>
            </div>
        </Form>
    )
}
