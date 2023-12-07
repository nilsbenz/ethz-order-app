import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { getTableLabel } from "@/lib/tables";
import { Event, TableConfig, TableLabelType } from "@order-app/types";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  cn,
} from "@order-app/ui";
import { doc, updateDoc } from "firebase/firestore";
import {
  EraserIcon,
  Loader2Icon,
  RefreshCcwIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";

const labelTypeOptions = [
  { value: TableLabelType.Alphabetic, label: "Alphabetisch" },
  { value: TableLabelType.Numeric, label: "Numerisch" },
] as const;

export default function Tables() {
  const queryClient = useQueryClient();
  const event = useEventStore((state) => state.event);
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);
  const [colLabels, setColLabels] = useState<TableLabelType>(
    TableLabelType.Alphabetic
  );
  const [rowLabels, setRowLabels] = useState<TableLabelType>(
    TableLabelType.Alphabetic
  );
  const [tables, setTables] = useState<TableConfig["tables"]>([]);
  const [hasSelfService, setHasSelfService] = useState(false);
  const [selfServicePrefix, setselfServicePrefix] = useState("S");
  const [busy, setBusy] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (tables: Event["tables"]) => {
      await updateDoc(
        doc(db, Collection.Events, event!.id).withConverter(eventConverter),
        { tables }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
      toast.success("Speichern erfolgreich!");
    },
    onError: () => {
      toast.error("Etwas ist schief gelaufen...");
    },
  });

  function reset() {
    if (event) {
      setNumCols(event.tables.colCount);
      setNumRows(event.tables.rowCount);
      setColLabels(event.tables.colLabels);
      setRowLabels(event.tables.rowLabels);
      setTables(event.tables.tables);
      setHasSelfService(event.tables.hasSelfService);
      setselfServicePrefix(event.tables.selfServicePrefix);
    }
  }

  async function handleSave() {
    try {
      setBusy(true);
      await saveMutation.mutateAsync({
        colCount: numCols,
        rowCount: numRows,
        colLabels,
        rowLabels,
        tables: tables
          .filter((t) => t.col < numCols && t.row < numRows)
          .sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col)),
        hasSelfService: hasSelfService && !!selfServicePrefix.trimStart(),
        selfServicePrefix: selfServicePrefix.trimStart(),
      });
    } finally {
      setBusy(false);
    }
  }

  function handleTableClicked(table: { col: number; row: number }) {
    return () => {
      setTables((prev) =>
        prev.some((t) => t.col === table.col && t.row === table.row)
          ? prev.filter((t) => !(t.col === table.col && t.row === table.row))
          : [...prev, table]
      );
    };
  }

  function handleEnableAll() {
    setTables(
      new Array(numCols)
        .fill(null)
        .flatMap((_, col) =>
          new Array(numRows).fill(null).map((_, row) => ({ col, row }))
        )
    );
  }

  useEffect(() => {
    reset();
  }, [event?.tables]);

  if (!event) {
    return (
      <div className="grid min-h-[40vh] place-items-center delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1">
        <h2 className="h1 flex-grow">Tische</h2>
        <Button variant="ghost" size="icon" onClick={reset} disabled={busy}>
          <RefreshCcwIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          disabled={busy}
        >
          <SaveIcon />
        </Button>
      </div>
      <h3 className="h2">Selbstbedienung</h3>
      <div className="space-y-2 rounded-lg border p-4">
        <div className="flex flex-row items-center justify-between">
          <Label className="text-base">Selbstbedienung</Label>
          <Switch
            checked={hasSelfService}
            onCheckedChange={setHasSelfService}
          />
        </div>
        {hasSelfService && (
          <div>
            <Label htmlFor="selfServicePrefix">Präfix</Label>
            <Input
              id="selfServicePrefix"
              value={selfServicePrefix}
              onChange={(e) => setselfServicePrefix(e.currentTarget.value)}
            />
          </div>
        )}
      </div>
      <h3 className="h2 pt-4">Reihen</h3>
      <div className="grid grid-cols-2 items-center gap-4">
        <Label className="flex justify-between">
          <span>Anzahl</span>
          <span>{numCols}</span>
        </Label>
        <Slider
          min={1}
          max={12}
          step={1}
          value={[numCols]}
          onValueChange={([v]) => setNumCols(v)}
        />
        <Label htmlFor="colLabels">Bezeichnung</Label>
        <Select
          value={colLabels}
          onValueChange={(v) => setColLabels(v as TableLabelType)}
        >
          <SelectTrigger id="colLabels">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {labelTypeOptions.map((labelType) => (
              <SelectItem key={labelType.value} value={labelType.value}>
                {labelType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <h3 className="h2 pt-4">Tische pro Reihe</h3>
      <div className="grid grid-cols-2 items-center gap-4">
        <Label className="flex justify-between">
          <span>Anzahl</span>
          <span>{numRows}</span>
        </Label>
        <Slider
          min={1}
          max={20}
          step={1}
          value={[numRows]}
          onValueChange={([v]) => setNumRows(v)}
        />
        <Label htmlFor="rowLabels">Bezeichnung</Label>
        <Select
          value={rowLabels}
          onValueChange={(v) => setRowLabels(v as TableLabelType)}
        >
          <SelectTrigger id="rowLabels">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {labelTypeOptions.map((labelType) => (
              <SelectItem key={labelType.value} value={labelType.value}>
                {labelType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1 pt-4">
        <h3 className="h2 flex-grow">Tische</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTables([])}
          className="h-9 w-9"
        >
          <EraserIcon className="w-5" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleEnableAll}>
          Alle markieren
        </Button>
      </div>
      <p>Klicke auf einzelne Tische, um sie zu (de)aktivieren.</p>
      <div
        className="grid gap-2 overflow-x-scroll rounded-lg border border-border bg-card p-2 transition-colors"
        style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}
      >
        {new Array(numCols).fill(null).map((_, col) => (
          <div
            key={col}
            className="grid gap-2"
            style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}
          >
            {new Array(numRows).fill(null).map((_, row) => {
              const tableEnabled = tables.find(
                (t) => t.col === col && t.row === row
              );
              return (
                <button
                  key={row}
                  className={cn(
                    "grid aspect-square max-h-[5rem] w-full min-w-[4rem] place-items-center rounded-md border border-border bg-background transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                    tableEnabled
                      ? "shadow-sm"
                      : "bg-muted text-muted-foreground"
                  )}
                  onClick={handleTableClicked({ col, row })}
                >
                  <p className="text-xl font-medium tabular-nums">
                    {getTableLabel(
                      colLabels === TableLabelType.Numeric ? col + 9 : col,
                      colLabels
                    )}
                    {getTableLabel(row, rowLabels)}
                  </p>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
