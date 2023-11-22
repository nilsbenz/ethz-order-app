import { functions } from "@/lib/firebase";
import useAuthStore from "@/lib/store/auth";
import { Button } from "@order-app/ui";
import { httpsCallable } from "firebase/functions";

export default function Admin() {
  const user = useAuthStore((state) => state.user);

  async function setSelfAdmin() {
    httpsCallable(
      functions,
      "updateSuperAdminStatus"
    )({ userId: user?.uid, isSuperAdmin: true }).catch(() => {
      alert("Ein Fehler ist aufgetreten!");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Admin</h2>
      <Button onClick={setSelfAdmin}>Set admin</Button>
      <p>Manage admins and companies</p>
    </div>
  );
}
