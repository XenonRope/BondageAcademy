export default function Character(props: { x: number; y: number }) {
  return (
    <div
      class="absolute w-[48px] h-[48px] rounded-[50%] bg-red-400"
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    />
  );
}
