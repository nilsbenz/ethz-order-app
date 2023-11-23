import { signOut } from "@/lib/auth";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import { Button, Input, Label } from "@order-app/ui";
import { doc, updateDoc } from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.userData);
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
      await updateDoc(
        doc(db, Collection.Users, userData?.id).withConverter(appUserConverter),
        { displayName: displayNameInput.current?.value }
      );
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
      <h2 className="h1">Profil</h2>
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
      <p>Allow the user to update his profile.</p>
      <Button onClick={handleSignOutClicked} variant="destructive">
        Ausloggen
      </Button>
    </div>
  );
}
