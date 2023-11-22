import { signOut } from "@/lib/auth";
import { Page } from "@/lib/pages";
import { Button } from "@order-app/ui";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  async function handleSignOutClicked() {
    await signOut();
    navigate(Page.Index);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Profil</h2>
      <p>Allow the user to update his profile.</p>
      <Button onClick={handleSignOutClicked} variant="destructive">
        Ausloggen
      </Button>
    </div>
  );
}
