import { getSession } from '@/lib/auth'

export default async function AdminPage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Tableau de Bord Administrateur</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="matrix-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Techniciens</h2>
          <p className="text-gray-400">Gérer les comptes techniciens</p>
          <a href="/admin/technicians" className="mt-4 block text-matrix-red hover:underline">Voir les techniciens →</a>
        </div>
        
        <div className="matrix-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Interventions</h2>
          <p className="text-gray-400">Vue globale des interventions</p>
          <a href="/admin/interventions" className="mt-4 block text-matrix-red hover:underline">Voir les interventions →</a>
        </div>
        
        <div className="matrix-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Clients</h2>
          <p className="text-gray-400">Gérer la base de clients</p>
          <a href="/admin/clients" className="mt-4 block text-matrix-red hover:underline">Voir les clients →</a>
        </div>
      </div>
    </div>
  )
}
