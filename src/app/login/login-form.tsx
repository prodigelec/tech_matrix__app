'use client'

import { useActionState } from 'react'
import { login, LoginState } from '@/app/actions/auth'
import { Loader2 } from 'lucide-react'

const initialState: LoginState = {
  message: '',
  errors: {},
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="matrix-label">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="matrix-input"
            placeholder="technicien@matrix-fitness.com"
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
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </div>
    </form>
  )
}
