type EPOSAlignment = "ALIGN_LEFT" | "ALIGN_CENTER" | "ALIGN_RIGHT";
type EPOSFont =
  | "FONT_A"
  | "FONT_B"
  | "FONT_C"
  | "FONT_D"
  | "FONT_E"
  | "FONT_SPECIAL_A"
  | "FONT_SPECIAL_B";
type EPOSTextSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type EPOSLineStyle =
  | "LINE_THIN"
  | "LINE_MEDIUM"
  | "LINE_THICK"
  | "LINE_THIN_DOUBLE"
  | "LINE_MEDIUM_DOUBLE"
  | "LINE_THICK_DOUBLE";
type EPOSCutType = "feed" | "no_feed";
type EPOSLayoutType =
  | "LAYOUT_RECEIPT"
  | "LAYOUT_RECEIPT_BM"
  | "LAYOUT_LABEL"
  | "LAYOUT_LABEL_BM";

type EPOSPrinter = {
  addTextAlign: () => EPOSPrinter;
  addText: (data: string) => EPOSPrinter;
  addTextFont: (font: EPOSFont) => EPOSPrinter;
  addTextSize: (width?: EPOSTextSize, height?: EPOSTextSize) => EPOSPrinter;
  addTextStyle: (
    reverse: boolean | undefined,
    underscore: boolean | undefined,
    bold: boolean | undefined,
    color: string | undefined
  ) => EPOSPrinter;
  addTextPosition: (x: number) => EPOSPrinter;
  addTextVPosition: (y: number) => EPOSPrinter;
  /**
   * Adds paper-feed-by-dot amount setting to the command buffer.
   * @param unit Integer from 0 to 255
   * @returns EPOSPrinter
   */
  addFeedUnit: (unit: number) => EPOSPrinter;
  /**
   * Adds paper-feed-by-line amount setting to the command buffer.
   * @param line Integer from 0 to 255
   * @returns EPOSPrinter
   */
  addFeedLine: (line: number) => EPOSPrinter;
  /**
   * Adds a line feed to the command buffer.
   * @returns EPOSPrinter
   */
  addFeed: () => void;
  addHLine: (
    startPos: number,
    endPos: number,
    style?: EPOSLineStyle
  ) => EPOSPrinter;
  addCut: (type?: EPOSCutType) => EPOSPrinter;
  addLayout: (
    type: EPOSLayoutType,
    width: number,
    height: number,
    marginTop: number,
    marginBottom: number,
    offsetCut: number,
    offsetLabel: number
  ) => EPOSPrinter;
  reset: () => void;
  send: (printJobId?: string) => void;
  getPrintJobStatus: (printJobId: string) => void;
  onreceive: (
    success: boolean,
    code: string,
    status: number,
    battery: number,
    printJobId: string
  ) => void;
  onstatuschange: (status: number) => void;
  onbatterystatuschange: (battery: number) => void;
  ononline: () => void;
  onoffline: () => void;
  onpoweroff: () => void;
  oncoverok: () => void;
  oncoveropen: () => void;
  onpaperok: () => void;
  onpapernearend: () => void;
  onpaperend: () => void;
  ondrawerclosed: () => void;
  ondraweropen: () => void;
  onbatteryok: () => void;
  onbatterylow: () => void;

  CUT_FEED: "feed";
  CUT_NO_FEED: "no_feed";
};

type EPOSDeviceConnectStatus =
  | "OK"
  | "SSL_CONNECT_OK"
  | "ERROR_TIMEOUT"
  | "ERROR_PARAMETER";
type EPOSDeviceType = "type_printer";
type EPOSDeviceCreateStatus =
  | "OK"
  | "DEVICE_NOT_FOUND"
  | "DEVICE_IN_USE"
  | "DEVICE_OPEN_ERROR"
  | "DEVICE_TYPE_INVALID"
  | "PARAM_ERROR"
  | "SYSTEM_ERROR";
type EPOSDeviceDeleteStatus =
  | "OK"
  | "DEVICE_NOT_OPEN"
  | "DEVICE_CLOSE_ERROR"
  | "SYSTEM_ERROR";

type EPOSDevice = {
  new (): EPOSDevice;
  connect: (
    ipAddress: string,
    port: string | number,
    callback: (status: EPOSDeviceConnectStatus) => void
  ) => void;
  disconnect: () => void;
  isConnected: () => boolean;
  createDevice: (
    deviceId: "local_printer",
    deviceType: EPOSDeviceType,
    options: { crypto: boolean; buffer: boolean },
    callback: (printer: EPOSPrinter, status: EPOSDeviceCreateStatus) => void
  ) => void;
  deleteDevice: (
    printer: EPOSPrinter,
    callback: (status: EPOSDeviceDeleteStatus) => void
  ) => void;
  onreconnecting: unknown;
  onreconnect: unknown;
  ondisconnect: unknown;

  current: EPOSPrinter;

  DEVICE_TYPE_PRINTER: "type_printer";
  IFPORT_EPOSDEVICE: 8008;
  IFPORT_EPOSDEVICE_S: 8043;
};

interface Window {
  epson: { ePOSDevice: EPOSDevice };
}
