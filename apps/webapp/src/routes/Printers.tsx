import usePrinter from "@/lib/hooks/usePrinter";
import { Button, Input } from "@order-app/ui";
import { FormEvent, useState } from "react";

const ThermalPrinter = () => {
  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.1.192");
  const [printerPort, setPrinterPort] = useState("8043");
  const [textToPrint, setTextToPrint] = useState("Hello world!");

  const { printer, connectionStatus, connect } = usePrinter();

  function handleConnect(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    connect(printerIPAddress, printerPort);
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
          disabled={connectionStatus === "Connected"}
          className="col-span-2"
        >
          Connect
        </Button>
      </form>
      <p>Connection status: {connectionStatus}</p>
      {connectionStatus === "Connected" && (
        <form className="grid grid-cols-1 gap-4" onSubmit={handlePrint}>
          <Input
            placeholder="Text to print"
            value={textToPrint}
            onChange={(e) => setTextToPrint(e.currentTarget.value)}
          />
          <Button disabled={connectionStatus !== "Connected"}>Print</Button>
        </form>
      )}
    </div>
  );
};

export default ThermalPrinter;
