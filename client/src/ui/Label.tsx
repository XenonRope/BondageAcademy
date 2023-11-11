import type { JSX } from "solid-js";

export default function Label(props: { children?: JSX.Element; for?: string }) {
  return (
    <label for={props.for} class="block mb-2 text-sm font-medium text-gray-900">
      {props.children}
    </label>
  );
}
