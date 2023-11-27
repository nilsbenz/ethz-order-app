import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import { FIND_USER_QUERY } from "@/lib/queries";
import { AppUser } from "@order-app/types";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@order-app/ui";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "usehooks-ts";

export default function FindUser({
  value: untransformedValue,
  onSelect,
}: {
  value: string;
  onSelect: (user?: AppUser) => void;
}) {
  const value = untransformedValue.toLowerCase();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const nameQuery = useDebounce(inputValue, 200);
  const comboboxRef = useRef<HTMLButtonElement>(null);

  const { data: options, status } = useQuery({
    queryKey: [FIND_USER_QUERY, nameQuery],
    queryFn: async () => {
      if (nameQuery.length < 3) {
        if (untransformedValue) {
          const res = await getDoc(
            doc(db, Collection.Users, untransformedValue).withConverter(
              appUserConverter
            )
          );
          if (res.exists()) {
            return [
              {
                value: res.id.toLowerCase(),
                label: res.data()?.displayName,
                userObject: res.data(),
              },
            ];
          } else {
            onSelect(undefined);
            return [];
          }
        } else {
          return [];
        }
      }
      const formattedQuery = nameQuery.toLowerCase().replace(" ", "");
      const q = query(
        collection(db, Collection.Users),
        where("searchName", ">=", formattedQuery),
        where("searchName", "<=", formattedQuery + "\uf8ff")
      ).withConverter(appUserConverter);
      const res = await getDocs(q);
      return res.docs.map((s) => ({
        value: s.id.toLowerCase(),
        label: s.data().displayName,
        userObject: s.data(),
      }));
    },
  });

  function handleSelect(selected: string) {
    setOpen(false);
    const user = options?.find((u) => u.value === selected)?.userObject;
    if (user) {
      onSelect(user);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between")}
          ref={comboboxRef}
        >
          {value
            ? options?.find((u) => u.value === value)?.label
            : "Nutzer wählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: (comboboxRef.current?.clientWidth ?? 200) - 16 }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Nutzer suchen..."
            value={inputValue}
            onValueChange={(v) => setInputValue(v)}
          />
          <CommandEmpty>
            {status === "loading"
              ? "Nutzer werden geladen..."
              : nameQuery.length < 3
              ? "Bitte mindestens 3 Buchstaben eingeben."
              : "Kein Nutzer gefunden."}
          </CommandEmpty>
          <CommandGroup>
            {options?.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
