import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Technicien</h1>
      <p>Bienvenue, {session?.name || 'Technicien'}</p>
      <div className="mt-8 p-6 bg-matrix-dark rounded-lg border border-matrix-border">
        <h2 className="text-xl font-bold mb-4">Mes Interventions</h2>
        <p className="text-gray-400">Aucune intervention assignée pour le moment.</p>
      </div>
    </div>
  );
}
