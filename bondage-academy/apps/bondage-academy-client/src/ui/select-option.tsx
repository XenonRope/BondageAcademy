import { JSX } from "solid-js/jsx-runtime";

export default function SelectOption(props: {
  children?: JSX.Element;
  value: string;
}) {
  return <option value={props.value}>{props.children}</option>;
}
