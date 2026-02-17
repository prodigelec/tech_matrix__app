import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-matrix-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="matrix-logo-box">
            M
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
          Matrix Tech Web
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Portail de gestion des interventions techniques
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="matrix-card py-8 px-4 sm:px-10">
          <LoginForm />
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; 2024 Matrix Fitness France. Tous droits réservés.
      </div>
    </div>
  )
}
