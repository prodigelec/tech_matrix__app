import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session) {
    if (session.role === 'ADMIN') {
      redirect('/admin');
    }
    // Par défaut, redirection vers le dashboard pour les autres rôles (TECHNICIAN)
    redirect('/dashboard');
  }

  // Si pas connecté, direction login
  redirect("/login");
}
