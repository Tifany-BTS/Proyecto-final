import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { AppRoutes } from "../router/app-router";
import { useCartStore } from "../stores/use-cart-store";
import { checkoutSchema } from "../schemas/checkout-schema";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

function renderWithProviders(initialEntries: string[] = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe("Purple Bloom — Verificación Fase 3 (CA-01 a CA-06)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("CA-01: Renderiza el catálogo con prendas y muestra fallback visual degradado para prendas sin imagen", async () => {
    renderWithProviders(["/"]);

    const blusa = await screen.findByText("Blusa Lavanda");
    expect(blusa).toBeInTheDocument();

    expect(screen.getByTestId("fallback-blusa-estampada")).toBeInTheDocument();
    expect(screen.getByTestId("fallback-pantalon-wide-leg")).toBeInTheDocument();
  });

  it("CA-02 / RN-02: Deshabilita el botón de compra con la etiqueta Agotado cuando stock === 0", async () => {
    renderWithProviders(["/producto/vestido-elegante"]);

    const outOfStockBtn = await screen.findByRole("button", { name: "Agotado" });
    expect(outOfStockBtn).toBeDisabled();
  });

  it("CA-03 / RN-01: Bloquea la adición al carrito si no se eligió talla y permite añadir al elegir talla válida", async () => {
    renderWithProviders(["/producto/blusa-lavanda"]);

    const addBtn = await screen.findByRole("button", { name: "AGREGAR A MI CARRITO" });
    fireEvent.click(addBtn);

    expect(screen.getByRole("alert")).toHaveTextContent("Elige una talla para añadir al carrito");
    expect(useCartStore.getState().items).toHaveLength(0);

    const sizeSelect = screen.getByLabelText("Talla");
    fireEvent.change(sizeSelect, { target: { value: "M" } });
    fireEvent.click(addBtn);

    expect(useCartStore.getState().items).toEqual([
      { productId: "blusa-lavanda", size: "M", color: "Lavanda", quantity: 1 },
    ]);
    expect(screen.getByTestId("header-cart-count")).toHaveTextContent("1");
  });

  it("CA-04 y CA-05 / RN-03: Asistente de color muestra error fuera de la prenda y guía cromática al tocar la prenda", () => {
    renderWithProviders(["/asistente-colores"]);

    const touchArea = screen.getByTestId("garment-touch-area");
    vi.spyOn(touchArea, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      width: 400,
      height: 400,
      right: 400,
      bottom: 400,
      toJSON: () => {},
    });

    fireEvent.click(touchArea, { clientX: 10, clientY: 10 });
    expect(screen.getByRole("alert")).toHaveTextContent("No se encuentra la blusa o prenda");

    fireEvent.click(touchArea, { clientX: 200, clientY: 200 });
    expect(screen.getByText("Rosa Palo Suave")).toBeInTheDocument();
    expect(screen.getByText(/Combina bien:/)).toBeInTheDocument();
    expect(screen.getByText(/Con precaución:/)).toBeInTheDocument();
    expect(screen.getByText(/Evitar:/)).toBeInTheDocument();
  });

  it("CA-06: Valida el esquema Zod de checkout y completa el flujo mostrando el Modal de confirmación", async () => {
    const invalidHome = checkoutSchema.safeParse({
      fullName: "Ana Pérez",
      email: "ana@ejemplo.com",
      deliveryMethod: "home",
      shippingAddress: "",
    });
    expect(invalidHome.success).toBe(false);

    const validPickup = checkoutSchema.safeParse({
      fullName: "Ana Pérez",
      email: "ana@ejemplo.com",
      deliveryMethod: "pickup",
      shippingAddress: "",
    });
    expect(validPickup.success).toBe(true);

    useCartStore.getState().addItem({
      productId: "blusa-lavanda",
      size: "S",
      color: "Lavanda",
      quantity: 2,
    });

    renderWithProviders(["/carrito"]);

    expect(await screen.findByText("Blusa Lavanda")).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("$99.98");

    fireEvent.click(screen.getByRole("button", { name: "Confirmar Compra" }));
    expect(await screen.findByText("Ingresa tu nombre completo.")).toBeInTheDocument();
    expect(screen.getByText("Correo electrónico no válido.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu dirección de envío.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: "Ana Pérez" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "ana@ejemplo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Dirección de envío/i), {
      target: { value: "Av. Amazonas N24-15" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Confirmar Compra" }));

    await waitFor(() => {
      expect(screen.getByText("¡Pedido confirmado con éxito!")).toBeInTheDocument();
    });
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
