import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
} from "@order-app/ui";
import { useState } from "react";

export default function SelectSelfServiceNumber({
  children,
  open,
  onOpenChange,
  onSubmit,
}: {
  children?: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (n: number) => void;
}) {
  const [selfServiceNumber, setSelfServiceNumber] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>Nummer eingeben</DialogHeader>
        <Input
          type="number"
          value={selfServiceNumber || ""}
          onChange={(e) => setSelfServiceNumber(e.currentTarget.valueAsNumber)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Abbrechen</Button>
          </DialogClose>
          <Button
            onClick={() => onSubmit(selfServiceNumber)}
            disabled={!selfServiceNumber || selfServiceNumber === 0}
          >
            Weiter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
