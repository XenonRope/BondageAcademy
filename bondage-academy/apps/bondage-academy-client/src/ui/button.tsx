import type { JSX } from "solid-js/jsx-runtime";

export default function Button(props: {
  children?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      classList={{
        "bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300":
          !props.disabled,
        "bg-primary-400 cursor-not-allowed": props.disabled,
      }}
      onClick={() => props.onClick?.()}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
