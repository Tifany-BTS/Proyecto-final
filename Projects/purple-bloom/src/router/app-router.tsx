import { Route, Routes } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { ViewCatalog } from "../views/ViewCatalog";
import { ViewProductDetail } from "../views/ViewProductDetail";
import { ViewColorAdvisor } from "../views/ViewColorAdvisor";
import { ViewCartCheckout } from "../views/ViewCartCheckout";
import { ViewNotFound } from "../views/ViewNotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ViewCatalog />} />
        <Route path="/catalogo" element={<ViewCatalog />} />
        <Route path="/producto/:id" element={<ViewProductDetail />} />
        <Route path="/asistente-colores" element={<ViewColorAdvisor />} />
        <Route path="/carrito" element={<ViewCartCheckout />} />
        <Route path="*" element={<ViewNotFound />} />
      </Route>
    </Routes>
  );
}
