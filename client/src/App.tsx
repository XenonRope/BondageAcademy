import { useKeyDownList } from "@solid-primitives/keyboard";
import { createSignal } from "solid-js";
import "./App.css";

export default function App() {
  const [count, setCount] = createSignal(0);
  const [position, setPosition] = createSignal([0, 0]);
  const keyDownList = useKeyDownList();

  setInterval(() => {
    const keys = keyDownList();
    const pos = [...position()];
    if (keys)
      if (keys.includes("W") && !keys.includes("S")) {
        pos[1]--;
      }
    if (!keys.includes("W") && keys.includes("S")) {
      pos[1]++;
    }
    if (keys.includes("A") && !keys.includes("D")) {
      pos[0]--;
    }
    if (!keys.includes("A") && keys.includes("D")) {
      pos[0]++;
    }
    if (pos[0] < 0) {
      pos[0] = 0;
    }
    if (pos[0] > 200) {
      pos[0] = 200;
    }
    if (pos[1] < 0) {
      pos[1] = 0;
    }
    if (pos[1] > 200) {
      pos[1] = 200;
    }
    setPosition(pos);
  }, 10);

  return (
    <>
      <button onClick={() => setPosition([20, 20])}>count is {count()}</button>
      <div class="w-[300px] h-[300px] relative">
        <div
          class="w-[20px] h-[20px] bg-red-300 absolute"
          style={{ left: `${position()[0]}px`, top: `${position()[1]}px` }}
        ></div>
      </div>
    </>
  );
}
