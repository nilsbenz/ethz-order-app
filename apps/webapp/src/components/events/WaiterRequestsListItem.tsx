import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { appUserConverter } from "@/lib/model/users";
import { EVENT_QUERY, USER_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { UserLevel, Waiter } from "@order-app/types";
import { Button } from "@order-app/ui";
import {
  arrayRemove,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { CheckSquareIcon, XSquareIcon } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function WaiterRequestsListItem({ waiter }: { waiter: Waiter }) {
  const event = useEventStore((state) => state.event);
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: user } = useQuery({
    queryKey: [USER_QUERY, waiter.userId],
    queryFn: async () => {
      const res = await getDoc(
        doc(db, Collection.Users, waiter.userId).withConverter(appUserConverter)
      );
      return res.data();
    },
  });
  const rejectMutation = useMutation({
    mutationFn: async ({
      waiter,
      eventId,
    }: {
      waiter: Waiter;
      eventId: string;
    }) => {
      await updateDoc(
        doc(db, Collection.Events, eventId).withConverter(eventConverter),
        { waiters: arrayRemove(waiter) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    },
  });
  const acceptMutation = useMutation({
    mutationFn: async ({
      waiter,
      eventId,
    }: {
      waiter: Waiter;
      eventId: string;
    }) => {
      const batch = writeBatch(db);
      batch.update(
        doc(db, Collection.Users, waiter.userId).withConverter(
          appUserConverter
        ),
        {
          level: UserLevel.Waiter,
          event: eventId,
          validUntil: waiter.disableAt.getTime(),
        }
      );
      batch.update(
        doc(db, Collection.Events, eventId).withConverter(eventConverter),
        { waiters: arrayRemove(waiter) }
      );
      await batch.commit();
      await httpsCallable(
        functions,
        "assignUserToEntity"
      )({
        userId: waiter.userId,
        entity: eventId,
        level: UserLevel.Waiter,
        validUntil: waiter.disableAt.getTime(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    },
  });

  async function handleRejectWaiter() {
    try {
      if (!event) {
        return;
      }
      setBusy(true);
      await rejectMutation.mutateAsync({ waiter, eventId: event.id });
    } finally {
      setBusy(false);
    }
  }

  async function handleAcceptWaiter() {
    try {
      if (!event) {
        return;
      }
      setBusy(true);
      await acceptMutation.mutateAsync({ waiter, eventId: event.id });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div key={waiter.userId} className="flex items-center gap-2 py-1">
      <p className="flex-grow whitespace-nowrap font-medium">
        {user?.displayName}
      </p>
      <div className="flex items-center gap-1 pr-2 md:pr-0">
        <p className="mr-1 tabular-nums text-muted-foreground">
          bis{" "}
          {waiter.disableAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={handleRejectWaiter}
          disabled={busy}
        >
          <XSquareIcon strokeWidth={2.25} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAcceptWaiter}
          disabled={busy}
        >
          <CheckSquareIcon strokeWidth={2.25} />
        </Button>
      </div>
    </div>
  );
}
