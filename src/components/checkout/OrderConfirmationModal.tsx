import { Modal, Text, Button, Stack, List } from "@mantine/core";
import type { CheckoutFormValues } from "../../schemas/checkout-schema";
import type { EnrichedCartLine } from "./CartTable";

export interface ConfirmedOrderSummary {
  customer: CheckoutFormValues;
  lines: EnrichedCartLine[];
  total: number;
}

interface OrderConfirmationModalProps {
  order: ConfirmedOrderSummary | null;
  onClose: () => void;
}

export function OrderConfirmationModal({ order, onClose }: OrderConfirmationModalProps) {
  return (
    <Modal
      opened={order !== null}
      onClose={onClose}
      title="¡Pedido confirmado con éxito!"
      centered
    >
      {order && (
        <Stack gap="sm">
          <Text>
            Gracias por tu compra, <strong>{order.customer.fullName}</strong>.
          </Text>
          <Text size="sm" c="dimmed">
            Enviamos el comprobante a {order.customer.email} (
            {order.customer.deliveryMethod === "home"
              ? `Envío a: ${order.customer.shippingAddress}`
              : "Retiro en tienda"}
            ).
          </Text>

          <List size="sm" spacing="xs">
            {order.lines.map((line) => (
              <List.Item key={`${line.productId}-${line.size}-${line.color}`}>
                {line.product.name} — Talla {line.size} ({line.color}) × {line.quantity}: $
                {line.subtotal.toFixed(2)}
              </List.Item>
            ))}
          </List>

          <Text fw={700} size="lg">
            Total pagado: ${order.total.toFixed(2)}
          </Text>

          <Button onClick={onClose} color="violet" mt="sm">
            Seguir comprando
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
