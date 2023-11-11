export default function TextInput(props: {
  value?: string;
  onInput?: (value: string) => void;
  id?: string;
}) {
  return (
    <input
      type="text"
      id={props.id}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      value={props.value ?? ""}
      onInput={(event) => {
        props.onInput?.(event.currentTarget.value);
      }}
    />
  );
}
