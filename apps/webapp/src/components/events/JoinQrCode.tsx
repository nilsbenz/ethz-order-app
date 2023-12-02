import useGeneralStore from "@/lib/store/general";
import { CloudIcon, Loader2Icon } from "lucide-react";
import QRCode from "qrcode";
import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function JoinQrCode() {
  const location = useLocation();
  const theme = useGeneralStore((state) => state.theme);
  const [qrCode, setQrCode] = useState("");

  useLayoutEffect(() => {
    QRCode.toString(window.location.origin + location.pathname, {
      type: "svg",
      color: {
        light: theme === "dark" ? "#000000" : "#FFFFFF",
        dark: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    }).then((res) => setQrCode(res));
  }, [theme]);

  if (!qrCode) {
    return (
      <div className="grid aspect-square place-items-center delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      <div className="absolute inset-0 bg-foreground mix-blend-screen transition-colors dark:bg-background" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-16 w-16 place-items-center rounded-lg bg-background p-3 text-lg font-medium text-primary sm:h-24 sm:w-24 sm:p-4">
          <CloudIcon strokeWidth={2.5} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
