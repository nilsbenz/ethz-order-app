import WaiterRequestsList from "@/components/events/WaiterRequestsList";
import WaitersList from "@/components/events/WaitersList";
import useEventWaiters from "@/lib/hooks/useEventWaiters";
import useEventStore from "@/lib/store/event";
import { useParams } from "react-router-dom";

export default function Waiters() {
  const { event: eventId } = useParams();
  const setWaiters = useEventStore((state) => state.setWaiters);
  useEventWaiters({ eventId, callback: setWaiters });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Personal verwalten</h2>
      <h3 className="h2">Aktives Personal</h3>
      <WaitersList />

      <h3 className="h2 mt-8">Beitrittsanfragen</h3>
      <WaiterRequestsList />
    </div>
  );
}
