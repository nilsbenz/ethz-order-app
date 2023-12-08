import { useRef, useState } from "react";

export const PrinterConnectionStatus = {
  Disconnected: "disconnected",
  Connecting: "connecting",
  Connected: "connected",
  Error: "error",
} as const;
export type PrinterConnectionStatus =
  (typeof PrinterConnectionStatus)[keyof typeof PrinterConnectionStatus];

export default function usePrinter() {
  const [connectionStatus, setConnectionStatus] =
    useState<PrinterConnectionStatus>(PrinterConnectionStatus.Disconnected);

  const ePosDevice = useRef<EPOSDevice>();
  const printer = useRef<EPOSDevice["current"]>();

  function connect(ip: string) {
    if (!ip) {
      setConnectionStatus(PrinterConnectionStatus.Error);
      return;
    }

    setConnectionStatus(PrinterConnectionStatus.Connecting);

    const ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(ip, ePosDev.IFPORT_EPOSDEVICE_S, (data) => {
      if (data === "OK" || data === "SSL_CONNECT_OK") {
        ePosDev.createDevice(
          "local_printer",
          ePosDev.DEVICE_TYPE_PRINTER,
          { crypto: true, buffer: true },
          (devobj, retcode) => {
            if (retcode === "OK") {
              printer.current = devobj;
              setConnectionStatus(PrinterConnectionStatus.Connected);
            } else {
              throw retcode;
            }
          }
        );
      } else {
        setConnectionStatus(PrinterConnectionStatus.Error);
        throw data;
      }
    });
  }

  return {
    connect,
    connectionStatus,
    printer,
  };
}
