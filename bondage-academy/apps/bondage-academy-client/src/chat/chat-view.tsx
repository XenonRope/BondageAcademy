import {
  ChatMessage,
  DialogueOption,
} from "@bondage-academy/bondage-academy-model";
import { For, Show, createSignal } from "solid-js";
import {
  chatService,
  dialogueOptionService,
  store,
  t,
  translator,
} from "../app/services";
import { sendMessageIcon } from "../ui/icons";
import TextInput from "../ui/text-input";
import DialogueOptionView from "./dialogue-option-view";

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
    return message.speaker ? translator(message.speaker) : "";
  }

  function getContent(message: ChatMessage): string {
    return message.content ? translator(message.content) : "";
  }

  function getDialogueOptions(): DialogueOption[] {
    return dialogueOptionService.getAvailableDialogueOptions();
  }

  function useDialogueOption(option: DialogueOption): void {
    dialogueOptionService.useDialogueOption(option).catch(console.log);
  }

  return (
    <div class="flex flex-col h-full">
      <div class="min-h-0 flex-grow overflow-y-auto p-1">
        <For each={store.chatMessages ?? []}>
          {(message) => (
            <div
              class="overflow-hidden break-words"
              style={{ "overflow-anchor": "none" }}
            >
              <Show when={message.action}>
                <span>*{getContent(message)}*</span>
              </Show>
              <Show when={!message.action}>
                <span class="font-bold">{getSpeaker(message) + ": "}</span>
                <span>{getContent(message)}</span>
              </Show>
            </div>
          )}
        </For>
        <For each={getDialogueOptions()}>
          {(option) => (
            <div class="mt-1" style={{ "overflow-anchor": "none" }}>
              <DialogueOptionView onClick={() => useDialogueOption(option)}>
                {t(option.content)}
              </DialogueOptionView>
            </div>
          )}
        </For>
        <div class="h-1"></div>
      </div>
      <div class="flex p-1">
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
