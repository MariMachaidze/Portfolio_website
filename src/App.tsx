import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/admin/RequireAuth";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";

const AdminLoginPage = lazy(() =>
  import("./pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);

function AdminLayout() {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminDashboardPage />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
