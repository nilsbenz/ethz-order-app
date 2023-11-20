import { Button } from "@order-app/ui";
import { Link } from "react-router-dom";
import { Page } from "../../lib/pages";

export default function Events() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Events</h2>
      <p>Allow the user to choose the action to perform for this event.</p>
      <Button asChild className="w-fit">
        <Link to={Page.Articles}>Artikel bearbeiten</Link>
      </Button>
    </div>
  );
}
