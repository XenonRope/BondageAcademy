import TextInput from "../ui/text-input";

export default function ChatView() {
  return (
    <div class="flex flex-col h-full p-1">
      <div class="flex-grow">User: Hello! How are you?</div>
      <div class="flex">
        <TextInput />
        <button
          type="button"
          class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100"
        >
          <svg
            class="w-6 h-6 text-gray-800 rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
