import { JSX } from "solid-js/jsx-runtime";

export default function SelectInput(props: {
  children?: JSX.Element;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}) {
  return (
    <div>
      <select
        id={props.id}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
        value={props.value}
        onChange={(event) => props.onChange?.(event.currentTarget.value)}
      >
        {props.children}
      </select>
    </div>
  );
}
