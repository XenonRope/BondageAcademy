import Character from "./character/character";
import World from "./world/World";

export default function App() {
  return (
    <World>
      <Character x={10} y={30}></Character>
      <Character x={20} y={80}></Character>
    </World>
  );
}
