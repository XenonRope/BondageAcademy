import TextInput from "../ui/TextInput";

export default function ChatView() {
  return (
    <div class="flex flex-col h-full">
      <div class="flex-grow">User: Hello! How are you?</div>
      <div>
        <TextInput />
      </div>
    </div>
  );
}
