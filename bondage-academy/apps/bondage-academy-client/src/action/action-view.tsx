import { t } from "../app/services";
import Button from "../ui/button";

export default function ActionView() {
  return (
    <div>
      <Button>{t("action.smile.smile")}</Button>
    </div>
  );
}
