import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";

export default function TwintCode({
  children,
  amount,
}: {
  children: JSX.Element;
  amount?: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Twint</DialogHeader>
        <div className="aspect-square w-full bg-sky-600" />
        {!!amount && (
          <p className="mt-2 text-center text-4xl font-medium">
            {`${amount.toFixed(2)} Fr.`.replace(".00", "")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
