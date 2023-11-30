import useEventStore from "@/lib/store/event";
import TableView from "../lists/TableView";
import WaiterRequestsListItem from "./WaiterRequestsListItem";

export default function WaiterRequestsList() {
  const waiters = useEventStore((state) => state.event?.waiters);

  return (
    <TableView loading={!waiters}>
      {waiters?.map((waiter) => (
        <WaiterRequestsListItem key={waiter.userId} waiter={waiter} />
      ))}
    </TableView>
  );
}
