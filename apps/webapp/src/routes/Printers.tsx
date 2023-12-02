import { Button, Input } from "@order-app/ui";
import { FormEvent, useRef, useState } from "react";

const ThermalPrinter = () => {
  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.1.191");
  const [printerPort, setPrinterPort] = useState("8080");
  const [textToPrint, setTextToPrint] = useState("Hello world!");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const ePosDevice = useRef<EPOSDevice>();
  const printer = useRef<EPOSDevice["current"]>();

  const STATUS_CONNECTED = "Connected";

  function handleConnect(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!printerIPAddress) {
      setConnectionStatus("Type the printer IP address");
      return;
    }
    if (!printerPort) {
      setConnectionStatus("Type the printer port");
      return;
    }

    setConnectionStatus("Connecting ...");

    const ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(printerIPAddress, printerPort, (data) => {
      if (data === "OK") {
        ePosDev.createDevice(
          "local_printer",
          "DEVICE_TYPE_PRINTER",
          { crypto: true, buffer: false },
          (devobj, retcode) => {
            if (retcode === "OK") {
              printer.current = devobj;
              setConnectionStatus(STATUS_CONNECTED);
            } else {
              throw retcode;
            }
          }
        );
      } else {
        setConnectionStatus("Error whilst connecting." + data);
        throw data;
      }
    });
  }

  function handlePrint(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const prn = printer.current;
    if (!prn) {
      alert("Not connected to printer");
      return;
    }

    prn.addText(textToPrint);
    prn.addFeedLine(5);
    prn.addCut("CUT_FEED");

    prn.send();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Drucker</h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleConnect}>
        <Input
          placeholder="Printer IP Address"
          value={printerIPAddress}
          onChange={(e) => setPrinterIPAddress(e.currentTarget.value)}
        />
        <Input
          placeholder="Printer Port"
          value={printerPort}
          onChange={(e) => setPrinterPort(e.currentTarget.value)}
        />
        <Button
          disabled={connectionStatus === STATUS_CONNECTED}
          className="col-span-2"
        >
          Connect
        </Button>
      </form>
      <p>Connection status: {connectionStatus}</p>
      {connectionStatus === STATUS_CONNECTED && (
        <form className="grid grid-cols-1 gap-4" onSubmit={handlePrint}>
          <Input
            placeholder="Text to print"
            value={textToPrint}
            onChange={(e) => setTextToPrint(e.currentTarget.value)}
          />
          <Button disabled={connectionStatus !== STATUS_CONNECTED}>
            Print
          </Button>
        </form>
      )}
    </div>
  );
};

export default ThermalPrinter;
