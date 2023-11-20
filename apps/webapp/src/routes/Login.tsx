import { login } from "@/lib/auth";
import { Page } from "@/lib/pages";
import { Button, Input, Label } from "@order-app/ui";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const mailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const username = mailInput.current?.value;
      const password = passwordInput.current?.value;
      if (!username || !password) {
        setError("");
        return;
      }
      const res = await login(username, password);
      if (res.success) {
        navigate(Page.Index);
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
      <h2 className="h1">Anmelden</h2>
      <form
        className="mx-auto my-8 flex w-full max-w-xs flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="mail">Mailadresse</Label>
          <Input id="mail" ref={mailInput} required />
        </div>
        <div>
          <Label htmlFor="pass">Passwort</Label>
          <Input id="pass" type="password" ref={passwordInput} required />
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button type="submit" disabled={loading}>
          Anmelden
        </Button>
      </form>
      <p>
        Du bist neu hier? <Link to={Page.Register}>Registrieren</Link>
      </p>
    </div>
  );
}
