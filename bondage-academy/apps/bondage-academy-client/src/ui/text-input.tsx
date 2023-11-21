export default function TextInput(props: {
  value?: string;
  onInput?: (value: string) => void;
  id?: string;
  type?: "text" | "password";
  autocomplete?: string;
}) {
  return (
    <input
      type={props.type ?? "text"}
      id={props.id}
      autocomplete={props.autocomplete}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
      value={props.value ?? ""}
      onInput={(event) => {
        props.onInput?.(event.currentTarget.value);
      }}
    />
  );
}
