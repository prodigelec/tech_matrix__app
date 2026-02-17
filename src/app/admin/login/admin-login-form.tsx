'use client'

import { useActionState } from 'react'
import { adminLogin, AdminLoginState } from '@/app/actions/admin-auth'
import { Loader2, Shield } from 'lucide-react'

const initialState: AdminLoginState = {
    message: '',
    errors: {},
}

export function AdminLoginForm() {
    const [state, formAction, isPending] = useActionState(adminLogin, initialState)

    return (
        <form action={formAction} className="space-y-6">
            {/* Admin Badge */}
            <div className="flex items-center justify-center space-x-2 pb-4 border-b border-matrix-border">
                <Shield className="h-5 w-5 text-matrix-red" />
                <span className="text-sm font-medium text-gray-300">Authentification Administrateur</span>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="matrix-label">
                    Email Administrateur
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="matrix-input"
                        placeholder="admin@matrix-fitness.com"
                    />
                </div>
                {state?.errors?.email && (
                    <p className="matrix-error-text">{state.errors.email[0]}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="matrix-label">
                    Mot de passe
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="matrix-input"
                        placeholder="••••••••"
                    />
                </div>
                {state?.errors?.password && (
                    <p className="matrix-error-text">{state.errors.password[0]}</p>
                )}
            </div>

            {/* General Error Message */}
            {state?.message && (
                <div className="matrix-error-box">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-400">{state.message}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="matrix-btn-primary"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Vérification en cours...
                        </>
                    ) : (
                        <>
                            <Shield className="mr-2 h-4 w-4" />
                            Accéder à l'administration
                        </>
                    )}
                </button>
            </div>

            <div className="text-center">
                <p className="text-xs text-gray-500">
                    Toutes les connexions sont enregistrées et surveillées
                </p>
            </div>
        </form>
    )
}
