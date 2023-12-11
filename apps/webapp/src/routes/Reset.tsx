import { resetPassword } from "@/lib/auth";
import { Page } from "@/lib/pages";
import { Button, Input, Label } from "@order-app/ui";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Register() {
  const location = useLocation();
  const mailInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const username = mailInput.current?.value;
      if (!username) {
        setError("Bitte geben Sie eine gültige E-Mail-Adresse an");
        return;
      }
      const res = await resetPassword(username);
      if (res.success) {
        setError(null);
        setSuccessMessage("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet!");
        return;
      }
      setError(res.message ?? null);
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Passwort zurücksetzen</h2>
      <form
        className="mx-auto my-8 flex w-full max-w-xs flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="mail">Mailadresse</Label>
          <Input id="mail" ref={mailInput} required />
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {successMessage && (
          <p className="text-sm font-medium text-success">{successMessage}</p>
        )}

        <Button type="submit" disabled={loading}>
          Passwort zurücksetzen
        </Button>
      </form>
      <p>
        Du bist neu hier?{" "}
        <Link to={{ pathname: Page.Register, search: location.search }}>
          Registrieren
        </Link>
      </p>
      <p>
        Du warst schon mal hier?{" "}
        <Link to={{ pathname: Page.Login, search: location.search }}>
          Anmelden
        </Link>
      </p>
    </div>
  );
}
