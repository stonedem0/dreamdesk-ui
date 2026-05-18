import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";
import { Radio, RadioGroup } from "../components/Radio";
import { Select } from "../components/Select";
import { Slider } from "../components/Slider";

// ── Checkbox ──────────────────────────────────────────────────────────────────

describe("Checkbox", () => {
  it("renders label", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("fires onChange with new checked state", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check me" onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders checked state", () => {
    render(<Checkbox label="Checked" checked onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not fire onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Disabled" disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Checkbox label="Disabled" disabled />);
    expect(container.firstChild).toHaveClass("dd-checkbox--disabled");
  });
});

// ── Radio / RadioGroup ────────────────────────────────────────────────────────

describe("RadioGroup", () => {
  it("renders all options", () => {
    render(
      <RadioGroup value="a" onChange={() => {}}>
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
        <Radio value="c" label="Gamma" />
      </RadioGroup>
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("marks correct option as checked", () => {
    render(
      <RadioGroup value="b" onChange={() => {}}>
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
      </RadioGroup>
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it("fires onChange with selected value", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup value="a" onChange={onChange}>
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
      </RadioGroup>
    );
    fireEvent.click(screen.getByLabelText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disabled radio cannot be selected", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup value="a" onChange={onChange}>
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" disabled />
      </RadioGroup>
    );
    fireEvent.click(screen.getByLabelText("Beta"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ── Select ────────────────────────────────────────────────────────────────────

const OPTIONS = [
  { value: "xp", label: "Windows XP" },
  { value: "98", label: "Windows 98" },
  { value: "vista", label: "Windows Vista" },
];

describe("Select", () => {
  it("renders all options", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Windows XP")).toBeInTheDocument();
    expect(screen.getByText("Windows 98")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<Select options={OPTIONS} label="Theme:" />);
    expect(screen.getByText("Theme:")).toBeInTheDocument();
  });

  it("fires onChange with selected value", () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} defaultValue="xp" onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "98" } });
    expect(onChange).toHaveBeenCalledWith("98");
  });

  it("renders disabled state", () => {
    render(<Select options={OPTIONS} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

// ── Slider ────────────────────────────────────────────────────────────────────

describe("Slider", () => {
  it("renders with label", () => {
    render(<Slider label="Volume:" defaultValue={50} />);
    expect(screen.getByText("Volume:")).toBeInTheDocument();
  });

  it("renders current value when showValue", () => {
    render(<Slider value={42} showValue onChange={() => {}} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("fires onChange with numeric value", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={0} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "75" } });
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it("renders disabled state", () => {
    render(<Slider disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
