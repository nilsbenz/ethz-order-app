import { updateUserProfile } from "@/lib/auth";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { Page, SubPage } from "@/lib/pages";
import { EVENT_QUERY } from "@/lib/queries";
import useAuthStore from "@/lib/store/auth";
import useCompanyStore from "@/lib/store/company";
import useEventStore from "@/lib/store/event";
import { Waiter } from "@order-app/types";
import { Button, Input, Label } from "@order-app/ui";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

export default function JoinEvent() {
  const company = useCompanyStore((state) => state.company);
  const event = useEventStore((state) => state.event);
  const userData = useAuthStore((state) => state.userData);
  const [formState, setFormState] = useState<"idle" | "modified" | "busy">(
    "idle"
  );
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState(userData?.displayName ?? "");
  const [workUntil, setWorkUntil] = useState("");

  const previousRequest = event?.waiters.find((w) => w.userId === userData?.id);

  const requestMutation = useMutation({
    mutationFn: async ({
      eventId,
      userId,
      disableAtTime,
    }: {
      eventId: string;
      userId: string;
      disableAtTime: string;
    }) => {
      const disableAt = new Date();
      const [hours, minutes] = disableAtTime.split(":");
      disableAt.setHours(parseInt(hours, 10));
      disableAt.setMinutes(parseInt(minutes, 10));
      disableAt.setSeconds(0);
      const waiter: Waiter = {
        userId,
        approved: false,
        checkedInAt: new Date(),
        disableAt,
      };
      await updateDoc(
        doc(db, Collection.Events, eventId).withConverter(eventConverter),
        { waiters: arrayUnion(waiter) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFormState("busy");
      if (!userData || !event) {
        return;
      }
      if (!displayName || !workUntil) {
        throw "not all fields filled out";
      }
      await Promise.allSettled([
        requestMutation.mutateAsync({
          eventId: event.id,
          userId: userData.id,
          disableAtTime: workUntil,
        }),
        updateUserProfile({ displayName }),
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setFormState("idle");
    }
  }

  async function handleUpdateRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFormState("busy");
      if (!userData || !event) {
        return;
      }
      if (!displayName || !workUntil) {
        throw "not all fields filled out";
      }
      const disableAt = new Date();
      const [hours, minutes] = workUntil.split(":");
      disableAt.setHours(parseInt(hours, 10));
      disableAt.setMinutes(parseInt(minutes, 10));
      disableAt.setSeconds(0);
      const waiter: Waiter = {
        userId: userData.id,
        approved: false,
        checkedInAt: new Date(),
        disableAt,
      };
      const batch = writeBatch(db);
      const eventRef = doc(db, Collection.Events, event.id).withConverter(
        eventConverter
      );
      batch.update(eventRef, { waiters: arrayRemove(previousRequest) });
      batch.update(eventRef, { waiters: arrayUnion(waiter) });
      await batch.commit();
    } catch (e) {
      console.log(e);
    } finally {
      setFormState("idle");
    }
  }

  useEffect(() => {
    if (userData?.displayName) {
      setDisplayName(userData.displayName);
    }
  }, [userData?.displayName]);

  useEffect(() => {
    if (previousRequest) {
      const [hours, minutes] = [
        previousRequest.disableAt.getHours(),
        previousRequest.disableAt.getMinutes(),
      ];
      setWorkUntil(`${hours}:${minutes}`);
    }
  }, [previousRequest]);

  if (!company || !event) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Event beitreten</h2>
      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1">
        <p className="text-muted-foreground">Verein:</p>
        <p>{company.displayName}</p>
        <p className="text-muted-foreground">Event:</p>
        <p>{event.displayName}</p>
      </div>
      {userData?.event === event.id ? (
        <>
          <p>Glückwunsch! Deine Anfrage wurde bestätigt.</p>
          <Link
            to={`${Page.Companies}/${company.id}/${SubPage.Events}/${event.id}`}
          >
            <Button>Zum Event</Button>
          </Link>
        </>
      ) : previousRequest ? (
        <>
          <p>Du hast bereits eine Anfrage für diesen Event erstellt.</p>
          <form className="flex flex-col gap-4" onSubmit={handleUpdateRequest}>
            <div>
              <Label htmlFor="untilInput">Du arbeitest bis</Label>
              <Input
                id="untilInput"
                type="time"
                step="900"
                value={workUntil}
                onChange={(e) => {
                  setWorkUntil(e.currentTarget.value);
                  setFormState("modified");
                }}
                disabled={formState === "busy"}
                required
              />
            </div>
            <Button disabled={formState !== "modified"}>
              Anfrage aktualisieren
            </Button>
          </form>
        </>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="displayNameInput">Dein Name</Label>
            <Input
              id="displayNameInput"
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
              disabled={formState === "busy"}
              required
            />
          </div>
          <div>
            <Label htmlFor="untilInput">Du arbeitest bis</Label>
            <Input
              id="untilInput"
              type="time"
              step="900"
              value={workUntil}
              onChange={(e) => setWorkUntil(e.currentTarget.value)}
              disabled={formState === "busy"}
              required
            />
          </div>
          <Button disabled={formState === "busy"}>Bestätigen</Button>
        </form>
      )}
    </div>
  );
}
