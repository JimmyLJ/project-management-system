import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "~/layouts/DashboardLayout";
import Dashboard from "~/pages/dashboard";
import Projects from "~/pages/projects";
import Teams from "~/pages/teams";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
