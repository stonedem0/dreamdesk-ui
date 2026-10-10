import type { Story } from "@ladle/react";
import { Button, type ButtonProps } from "../components/Button";

const VARIANTS = ["primary", "ghost", "basic", "help", "iridescent"] as const;
const SIZES = ["sm", "md", "lg"] as const;

/** Every variant at every size, plus disabled: switch themes above to compare. */
export const AllVariants: Story = () => (
  <table style={{ borderSpacing: 12 }}>
    <tbody>
      {VARIANTS.map((variant) => (
        <tr key={variant}>
          <td style={{ fontFamily: "monospace", fontSize: 12 }}>{variant}</td>
          {SIZES.map((size) => (
            <td key={size}><Button variant={variant} size={size}>{size}</Button></td>
          ))}
          <td><Button variant={variant} disabled>disabled</Button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

/** One button: change its props in the controls panel. */
export const Playground: Story<ButtonProps & { label: string }> = ({ label, ...props }) => <Button {...props}>{label}</Button>;
Playground.args = { label: "Start", disabled: false };
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: "select" }, defaultValue: "primary" },
  size: { options: SIZES, control: { type: "radio" }, defaultValue: "md" },
};
