import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-matrix-dark border-r border-matrix-border flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-matrix-border">
          <span className="text-xl font-bold text-white">Matrix Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="block px-4 py-2 rounded-md text-gray-300 hover:bg-matrix-red hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/technicians" 
            className="block px-4 py-2 rounded-md text-gray-300 hover:bg-matrix-red hover:text-white transition-colors"
          >
            Techniciens
          </Link>
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-8 border-t border-matrix-border pt-4"
          >
            Retour au Site
          </Link>
        </nav>

        <div className="p-4 border-t border-matrix-border">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-matrix-red flex items-center justify-center text-sm font-bold">
              {session.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{session.name}</p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-matrix-black p-8">
        {children}
      </main>
    </div>
  )
}
