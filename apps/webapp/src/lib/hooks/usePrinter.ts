import { useRef, useState } from "react";

export default function usePrinter() {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const ePosDevice = useRef<EPOSDevice>();
  const printer = useRef<EPOSDevice["current"]>();

  function connect(ip: string, port: string) {
    if (!ip) {
      setConnectionStatus("Type the printer IP address");
      return;
    }
    if (!port) {
      setConnectionStatus("Type the printer port");
      return;
    }

    setConnectionStatus("Connecting ...");

    const ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(ip, port, (data) => {
      if (data === "OK" || data === "SSL_CONNECT_OK") {
        ePosDev.createDevice(
          "local_printer",
          "DEVICE_TYPE_PRINTER",
          { crypto: true, buffer: false },
          (devobj, retcode) => {
            if (retcode === "OK") {
              printer.current = devobj;
              setConnectionStatus("Connected");
            } else {
              throw retcode;
            }
          }
        );
      } else {
        setConnectionStatus("Error whilst connecting – " + data);
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
