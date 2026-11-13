import { z } from "zod/v4";

export const checkoutSchema = z
  .object({
    fullName: z.string().min(1, { message: "Ingresa tu nombre completo." }),
    email: z.string().email({ message: "Correo electrónico no válido." }),
    deliveryMethod: z.enum(["home", "pickup"]),
    shippingAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.deliveryMethod === "home" &&
        (!data.shippingAddress || data.shippingAddress.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Ingresa tu dirección de envío.",
      path: ["shippingAddress"],
    }
  );

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
