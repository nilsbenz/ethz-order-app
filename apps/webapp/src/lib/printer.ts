import { Event, Order } from "@order-app/types";
import { doc, getDoc } from "firebase/firestore";
import { Collection } from "./collections";
import { db } from "./firebase";
import { appUserConverter } from "./model/users";

export async function printOrder(
  printer: EPOSPrinter,
  event: Event,
  order: Order
): Promise<{ success: boolean; code: string }> {
  const waiter = (
    await getDoc(
      doc(db, Collection.Users, order.createdBy).withConverter(appUserConverter)
    )
  ).data();

  printer.addFeedLine(4);
  printer.addTextSize(3, 3);
  printer.addTextStyle(false, false, true, undefined);
  printer.addText(`Tisch: ${order.table}`);
  printer.addFeed();
  printer.addTextSize(2, 2);
  printer.addText(waiter?.displayName ?? "Unbekannte Servierdüse");
  printer.addFeed();
  printer.addText(new Date(order.createdAt).toLocaleString("ch-de"));
  printer.addFeedLine(4);
  printer.addTextStyle(false, false, false, undefined);
  order.items.forEach((item) => {
    printer.addTextSize(2, 2);
    printer.addText(
      `${item.amount} x ${
        event.articles.find((a) => a.id === item.articleId)?.displayName ??
        "Unbekannter Artikel"
      }`
    );
    printer.addFeed();
    if (item.comment) {
      printer.addTextSize(1, 1);
      printer.addText(`    ${item.comment}`);
      printer.addFeed();
    }
  });
  printer.addFeedLine(2);
  printer.addCut(printer.CUT_FEED);

  return new Promise((res, rej) => {
    printer.onreceive = (success, code, status) => {
      if (success) {
        res({ success, code });
      } else {
        rej({ success, code, status });
      }
    };
    printer.send();
  });
}
