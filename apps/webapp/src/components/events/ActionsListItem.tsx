import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionsListItem({
  label,
  link,
}: {
  label: string;
  link: string;
}) {
  return (
    <div className="py-1">
      <Link to={link} className="flex items-center gap-2 py-1.5">
        <p className="flex-grow">{label}</p>
        <ChevronRightIcon className="h-5" strokeWidth={2.25} />
      </Link>
    </div>
  );
}
