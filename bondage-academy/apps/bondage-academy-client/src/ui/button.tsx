import type { JSX } from "solid-js/jsx-runtime";

export default function Button(props: {
  children?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  size?: "small" | "medium";
  class?: string;
}) {
  return (
    <button
      type="button"
      class={`text-white font-medium rounded-lg text-sm text-center ${
        props.class ?? ""
      }`}
      classList={{
        "bg-primary-700 hover:bg-primary-800": !props.disabled,
        "bg-primary-400 cursor-not-allowed": props.disabled,
        "px-2 py-1": props.size === "small",
        "px-5 py-2.5": !props.size || props.size === "medium",
      }}
      onClick={() => props.onClick?.()}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
