import { JSX } from "solid-js/jsx-runtime";

export default function DialogueOptionView(props: {
  children?: JSX.Element;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1 text-center"
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </button>
  );
}
