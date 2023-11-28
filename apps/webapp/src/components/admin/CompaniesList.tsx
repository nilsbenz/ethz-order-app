import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { companyConverter } from "@/lib/model/companies";
import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import { Company } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import { DialogClose } from "@order-app/ui/src/components/dialog";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CompaniesList() {
  const user = useAuthStore((state) => state.user);
  const [companies, setCompanies] = useState<Company[]>();
  const [busy, setBusy] = useState(false);

  function handleRemoveCompany(companyId: string) {
    return async () => {
      try {
        setBusy(true);
        await updateDoc(
          doc(db, Collection.Companies, companyId).withConverter(
            companyConverter
          ),
          { archived: true }
        );
      } finally {
        setBusy(false);
      }
    };
  }

  useEffect(() => {
    const companiesQuery = query(
      collection(db, Collection.Companies),
      where("archived", "==", false)
    ).withConverter(companyConverter);
    const unsubscribe = onSnapshot(companiesQuery, (snapshot) =>
      setCompanies(snapshot.docs.map((d) => d.data()))
    );
    return unsubscribe;
  }, [user?.uid]);

  return (
    <div className="flex flex-col divide-y">
      {companies?.map((company) => (
        <div key={company.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow">
            <Link
              to={`${Page.Companies}/${company.id}`}
              className="-mx-1 p-1 text-inherit"
            >
              {company.displayName}
            </Link>
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2Icon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Verein entfernen?</DialogHeader>
              <DialogDescription>
                Bist du dir sicher, dass du <b>{company.displayName}</b>{" "}
                entfernen möchtest? Diese Aktion kann nicht rückgängig gemacht
                werden.
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Abbrechen</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleRemoveCompany(company.id)}
                  disabled={busy}
                >
                  Entfernen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
