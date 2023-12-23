import { JSX } from "solid-js/jsx-runtime";
import Button from "../ui/button";

export default function DialogueOptionView(props: {
  children?: JSX.Element;
  onClick?: () => void;
}) {
  return (
    <Button onClick={() => props.onClick?.()} size="small">
      {props.children}
    </Button>
  );
}
