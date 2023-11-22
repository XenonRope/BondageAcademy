export default function TextArea(props: {
  value?: string;
  onInput?: (value: string) => void;
  id?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <textarea
      id="message"
      rows={props.rows || 2}
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
      value={props.value ?? ""}
      onInput={(event) => {
        props.onInput?.(event.currentTarget.value);
      }}
      maxLength={props.maxLength}
    ></textarea>
  );
}
