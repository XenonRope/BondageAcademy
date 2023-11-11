import { trackBounds } from "solid-boundaries";
import { For, createMemo } from "solid-js";
import CharacterView from "./CharacterView";
import {
  CHARACTER_VIEW_HEIGHT,
  CHARACTER_VIEW_WIDTH,
  type Character,
} from "./model/Character";

interface GridLayout {
  rows: number;
  columns: number;
}

export default function CharacterGridView(props: { characters: Character[] }) {
  const { ref, bounds } = trackBounds();
  const layout = createMemo(() => calculateOptimalGridLayout());

  function calculateOptimalGridLayout(): GridLayout {
    let rows = 1;
    let columns = 1;
    let count = 1;
    while (count < props.characters.length) {
      if (
        calculateCharacterViewSize({ rows: rows + 1, columns }) >
        calculateCharacterViewSize({ rows, columns: columns + 1 })
      ) {
        rows++;
      } else {
        columns++;
      }
      count = rows * columns;
    }
    return { rows, columns };
  }

  function calculateCharacterViewSize(grid: GridLayout): number {
    let width = (bounds()?.width ?? 0) / grid.columns;
    let height = (bounds()?.height ?? 0) / grid.rows;
    if (width / height > CHARACTER_VIEW_WIDTH / CHARACTER_VIEW_HEIGHT) {
      width = (height * CHARACTER_VIEW_WIDTH) / CHARACTER_VIEW_HEIGHT;
    } else {
      height = (width * CHARACTER_VIEW_HEIGHT) / CHARACTER_VIEW_WIDTH;
    }

    return width * height;
  }

  return (
    <div
      ref={ref}
      class="grid h-full"
      style={{
        "grid-template-rows": `repeat(${layout().rows}, ${
          100 / layout().rows
        }%)`,
        "grid-template-columns": `repeat(${layout().columns}, ${
          100 / layout().columns
        }%)`,
      }}
    >
      <For each={props.characters}>
        {(character) => (
          <div class="flex items-center justify-center">
            <CharacterView character={character} />
          </div>
        )}
      </For>
    </div>
  );
}
