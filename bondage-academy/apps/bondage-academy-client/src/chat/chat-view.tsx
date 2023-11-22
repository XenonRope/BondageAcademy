import { ChatMessage } from "@bondage-academy/bondage-academy-model";
import { For, createSignal } from "solid-js";
import { chatService, store, t } from "../app/services";
import { sendMessageIcon } from "../ui/icons";
import TextInput from "../ui/text-input";

export default function ChatView() {
  const [message, setMessage] = createSignal("");

  function sendMessage() {
    if (message() === "") {
      return;
    }
    chatService.speak(message()).catch(console.log);
    setMessage("");
  }

  function getSpeaker(message: ChatMessage): string {
    if (message.speakerDictionaryKey) {
      return t(message.speakerDictionaryKey) as string;
    }
    return message.speaker ?? "";
  }

  function getContent(message: ChatMessage): string {
    if (message.contentDictionaryKey) {
      return t(message.contentDictionaryKey) as string;
    }
    return message.content ?? "";
  }

  return (
    <div class="flex flex-col h-full p-1">
      <div class="min-h-0 flex-grow overflow-y-auto">
        <For each={store.chatMessages ?? []}>
          {(message) => (
            <div style={{ "overflow-anchor": "none" }}>
              <span class="incline-block font-bold mr-1">
                {getSpeaker(message) + ":"}
              </span>
              <span>{getContent(message)}</span>
            </div>
          )}
        </For>
        <div class="h-1"></div>
      </div>
      <div class="flex">
        <div
          class="w-full"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        >
          <TextInput value={message()} onInput={setMessage} />
        </div>
        <button
          type="button"
          class="inline-flex justify-center p-2 pr-[3px] text-primary-800 rounded-lg cursor-pointer hover:text-primary-700"
          onClick={sendMessage}
        >
          {sendMessageIcon()}
        </button>
      </div>
    </div>
  );
}
