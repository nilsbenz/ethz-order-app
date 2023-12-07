import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { getTableLabel } from "@/lib/tables";
import { TableLabelType } from "@order-app/types";
import { Button, cn } from "@order-app/ui";
import SelectSelfServiceNumber from "./SelectSelfServiceNumber";

export default function SelectTable() {
  const event = useEventStore((state) => state.event);
  const orderState = useOrderStore();

  function handleCreateSelfService(n: number) {
    orderState.createNewOrder(event!.id, event!.tables.selfServicePrefix + n);
  }

  if (!event || orderState.stage !== "initial") {
    return null;
  }

  return (
    <>
      {event.tables.hasSelfService && (
        <>
          <h3 className="h2">Selbstbedienung</h3>
          <SelectSelfServiceNumber onSubmit={handleCreateSelfService}>
            <Button variant="outline" className="mb-8 w-full">
              Selbstbedienung
            </Button>
          </SelectSelfServiceNumber>
        </>
      )}
      <h3 className="h2">Tisch wählen</h3>
      <div
        className="grid gap-2 overflow-x-scroll rounded-lg border border-border bg-card p-2 transition-colors"
        style={{ gridTemplateColumns: `repeat(${event.tables.colCount}, 1fr)` }}
      >
        {new Array(event.tables.colCount).fill(null).map((_, col) => (
          <div
            key={col}
            className="grid gap-2"
            style={{
              gridTemplateRows: `repeat(${event.tables.rowCount}, 1fr)`,
            }}
          >
            {new Array(event.tables.rowCount).fill(null).map((_, row) => {
              const tableEnabled = event.tables.tables.find(
                (t) => t.col === col && t.row === row
              );
              if (!tableEnabled) {
                return <div key={row} />;
              }
              const table =
                getTableLabel(
                  event.tables.colLabels === TableLabelType.Numeric
                    ? col + 9
                    : col,
                  event.tables.colLabels
                ) + getTableLabel(row, event.tables.rowLabels);

              return (
                <button
                  key={row}
                  className={cn(
                    "grid aspect-square max-h-[5rem] w-full min-w-[4rem] place-items-center rounded-md border border-border bg-background shadow-sm transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                  )}
                  onClick={() => orderState.createNewOrder(event.id, table)}
                >
                  <p className="text-xl font-medium tabular-nums">{table}</p>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
