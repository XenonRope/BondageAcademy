import type { JSX } from "solid-js/jsx-runtime";

export default function Button(props: {
  children?: JSX.Element;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </button>
  );
}
