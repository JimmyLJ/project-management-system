import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "~/features/auth/RequireAuth";
import SessionBootstrap from "~/features/auth/SessionBootstrap";
import DashboardLayout from "~/layouts/DashboardLayout";
import WorkspaceGate from "~/features/workspace/WorkspaceGate";
import Dashboard from "~/pages/dashboard";
import Login from "~/pages/login";
import Projects from "~/pages/projects";
import Register from "~/pages/register";
import Teams from "~/pages/teams";

export default function App() {
  return (
    <BrowserRouter>
      <SessionBootstrap />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <WorkspaceGate />
            </RequireAuth>
          }
        />
        <Route
          path="/w/:workspaceSlug"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
