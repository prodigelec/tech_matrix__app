import { AdminLoginForm } from './admin-login-form'

export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-matrix-black">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="matrix-logo-box">
                        M
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
                    Administration Matrix Tech
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Accès réservé aux administrateurs système
                </p>
                <div className="mt-2 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-matrix-red animate-pulse"></div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Espace Sécurisé</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="matrix-card py-8 px-4 sm:px-10">
                    <AdminLoginForm />
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
                &copy; 2026 Matrix Fitness France. Tous droits réservés.
            </div>
        </div>
    )
}
