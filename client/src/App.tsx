import Character from "./character/Character";
import { socketService } from "./common/SocketService";
import World from "./world/World";

export default function App() {
  socketService.initialize();

  return (
    <World>
      <Character x={10} y={30}></Character>
      <Character x={20} y={80}></Character>
    </World>
  );
}
