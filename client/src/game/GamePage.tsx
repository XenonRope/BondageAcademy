import { store } from "../common/Store";
import WorldView from "../world/WorldView";

export default function GamePage() {
  return <>{store.world && <WorldView world={store.world} />}</>;
}
