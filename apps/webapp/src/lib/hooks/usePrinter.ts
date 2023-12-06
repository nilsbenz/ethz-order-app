import { useRef, useState } from "react";

export default function usePrinter() {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const ePosDevice = useRef<EPOSDevice>();
  const printer = useRef<EPOSDevice["current"]>();

  function connect(ip: string, secure: boolean) {
    if (!ip) {
      setConnectionStatus("Type the printer IP address");
      return;
    }

    setConnectionStatus("Connecting ...");

    const ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(
      ip,
      secure ? ePosDev.IFPORT_EPOSDEVICE_S : ePosDev.IFPORT_EPOSDEVICE,
      (data) => {
        if (data === "OK" || data === "SSL_CONNECT_OK") {
          ePosDev.createDevice(
            "local_printer",
            ePosDev.DEVICE_TYPE_PRINTER,
            { crypto: false, buffer: false },
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
      }
    );
  }

  return {
    connect,
    connectionStatus,
    printer,
  };
}
