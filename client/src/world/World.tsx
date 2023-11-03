import { JSX } from "solid-js/jsx-runtime";

export default function World(props: { children?: JSX.Element }) {
  return (
    <div class="relative w-full h-full overflow-hidden">{props.children}</div>
  );
}
