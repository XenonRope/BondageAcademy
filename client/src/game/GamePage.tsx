import Character from "../character/Character";
import World from "../world/World";

export default function GamePage() {
  return (
    <World>
      <Character x={10} y={30} />
      <Character x={20} y={80} />
    </World>
  );
}
