import useGeneralStore from "@/lib/store/general";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import QRCode from "qrcode";
import { useLayoutEffect, useState } from "react";

export default function TwintCode({
  children,
  amount,
}: {
  children: JSX.Element;
  amount?: number;
}) {
  const [qrCode, setQrCode] = useState("");
  const theme = useGeneralStore((state) => state.theme);

  useLayoutEffect(() => {
    QRCode.toString(
      "02:ad5e87b2194248cf813c18d2cf98b2ce#54b03e5ee3080fa9fbe14a1fd12ffe7861a443eb#",
      {
        type: "svg",
        color: {
          light: theme === "dark" ? "#000000" : "#FFFFFF",
          dark: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      }
    ).then((res) => setQrCode(res));
  }, [theme]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Twint</DialogHeader>
        <div className="relative -m-4">
          <div dangerouslySetInnerHTML={{ __html: qrCode }} />
          <div className="absolute inset-0 bg-foreground mix-blend-screen transition-colors dark:bg-background" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-black p-2 text-lg font-medium text-primary sm:h-24 sm:w-24 sm:p-3">
              <img
                src="/twint.png"
                alt="Twint Code"
                className="aspect-square w-full"
              />
            </div>
          </div>
        </div>
        {!!amount && (
          <p className="mt-2 text-center text-4xl font-medium">
            {`${amount.toFixed(2)} Fr.`.replace(".00", "")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
