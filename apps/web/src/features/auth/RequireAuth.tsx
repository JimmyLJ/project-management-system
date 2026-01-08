import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthSession } from "./hooks";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dash-bg)] text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
