import type { Story } from "@ladle/react";
import { Tag, type TagProps } from "../components/Tag";

const STACK = ["Go", "TypeScript", "React", "Web Audio API", "D3"];

export const Tags: Story = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{STACK.map((t) => <Tag key={t}>{t}</Tag>)}</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{STACK.map((t) => <Tag key={t} iridescent>{t}</Tag>)}</div>
  </div>
);

export const Playground: Story<TagProps & { label: string }> = ({ label, ...props }) => <Tag {...props}>{label}</Tag>;
Playground.args = { label: "React", iridescent: false };
