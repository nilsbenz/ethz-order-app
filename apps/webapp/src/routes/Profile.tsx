import { signOut, updateUserProfile } from "@/lib/auth";
import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import { Button, Input, Label } from "@order-app/ui";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, userData] = useAuthStore((state) => [
    state.user,
    state.userData,
  ]);
  const displayNameInput = useRef<HTMLInputElement>(null);
  const [displayNameInputState, setDisplayNameInputState] = useState<
    "idle" | "modified" | "busy"
  >("idle");

  async function handleSignOutClicked() {
    await signOut();
    navigate(Page.Index);
  }

  async function handleSaveDisplayNameClicked(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userData) {
      return;
    }
    try {
      setDisplayNameInputState("busy");
      const displayName = displayNameInput.current?.value;
      await updateUserProfile({ displayName });
    } finally {
      setDisplayNameInputState("idle");
    }
  }

  useEffect(() => {
    if (displayNameInput.current && userData?.displayName) {
      displayNameInput.current.value = userData.displayName;
    }
  }, [userData?.displayName]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="h1">Profil</h2>
        <Button onClick={handleSignOutClicked} variant="destructive" size="sm">
          Abmelden
        </Button>
      </div>
      <div>
        <p>{user?.email}</p>
        <p className="text-muted-foreground">{user?.uid}</p>
      </div>
      <form
        className="flex flex-col gap-4 sm:flex-row"
        onSubmit={handleSaveDisplayNameClicked}
      >
        <div className="flex-grow">
          <Label htmlFor="displayNameInput">Benutzername</Label>
          <Input
            id="displayNameInput"
            ref={displayNameInput}
            className="w-full"
            onChange={() => setDisplayNameInputState("modified")}
            disabled={displayNameInputState === "busy"}
          />
        </div>
        {displayNameInputState !== "idle" && (
          <Button
            type="submit"
            className="self-end"
            disabled={displayNameInputState === "busy"}
          >
            Speichern
          </Button>
        )}
      </form>
    </div>
  );
}
