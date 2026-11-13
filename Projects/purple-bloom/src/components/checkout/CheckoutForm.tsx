import { useForm } from "@mantine/form";
import { TextInput, Radio, Group, Button, Stack } from "@mantine/core";
import { checkoutSchema, type CheckoutFormValues } from "../../schemas/checkout-schema";

interface CheckoutFormProps {
  disabled: boolean;
  onValidSubmit: (values: CheckoutFormValues) => void;
}

export function CheckoutForm({ disabled, onValidSubmit }: CheckoutFormProps) {
  const form = useForm<CheckoutFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      deliveryMethod: "home",
      shippingAddress: "",
    },
    validate: (values) => {
      const parsed = checkoutSchema.safeParse(values);
      if (parsed.success) return {};
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      return errors;
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onValidSubmit(values);
      })}
      noValidate
    >
      <Stack gap="md">
        <TextInput
          label="Nombre completo"
          placeholder="Ej. María Fernanda López"
          required
          disabled={disabled}
          {...form.getInputProps("fullName")}
        />

        <TextInput
          label="Correo electrónico"
          placeholder="maria@ejemplo.com"
          type="email"
          required
          disabled={disabled}
          {...form.getInputProps("email")}
        />

        <Radio.Group
          label="Método de entrega"
          value={form.values.deliveryMethod}
          onChange={(val) =>
            form.setFieldValue("deliveryMethod", val as "home" | "pickup")
          }
        >
          <Group mt="xs">
            <Radio value="home" label="Envío a domicilio" disabled={disabled} />
            <Radio value="pickup" label="Retiro en tienda" disabled={disabled} />
          </Group>
        </Radio.Group>

        {form.values.deliveryMethod === "home" && (
          <TextInput
            label="Dirección de envío"
            placeholder="Calle principal, número y ciudad"
            required
            disabled={disabled}
            {...form.getInputProps("shippingAddress")}
          />
        )}

        <Button type="submit" color="violet" disabled={disabled} size="md">
          Confirmar Compra
        </Button>
      </Stack>
    </form>
  );
}
