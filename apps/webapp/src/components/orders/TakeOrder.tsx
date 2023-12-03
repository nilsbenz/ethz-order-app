import useOrderStore from "@/lib/store/order";
import SelectItems from "./SelectItems";
import SelectTable from "./SelectTable";

export default function TakeOrder() {
  const stage = useOrderStore((state) => state.stage);

  switch (stage) {
    case "initial":
      return <SelectTable />;
    case "draft":
      return <SelectItems />;
    case "payment":
      return "payment";
    case "success":
      return "success";
  }
}
