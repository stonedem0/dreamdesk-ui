import type { CSSProperties, MouseEventHandler } from "react";

type CustomElProps = {
  class?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  "data-tab"?: string;
  "data-tab-index"?: string;
  "data-panel"?: string;
  onClick?: MouseEventHandler;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dreamdesk-tab": CustomElProps;
      "dreamdesk-tab-panel": CustomElProps;
    }
  }
}
