import { useAuth } from '../hooks/useAuth.js';

/** Placeholder until Phase 8 adds summary cards and charts. */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Hi, {user.name} 👋</h1>
      <p className="mt-1 text-slate-500">Your dashboard is on its way.</p>
    </section>
  );
}
