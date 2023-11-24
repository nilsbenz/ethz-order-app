import NewSuperAdminForm from "@/components/admin/NewSuperAdminForm";
import SuperAdminList from "@/components/admin/SuperAdminList";

export default function Admin() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Admin</h2>

      <div className="flex justify-between">
        <h3 className="h2">Super Admins</h3>
        <NewSuperAdminForm />
      </div>
      <SuperAdminList />
    </div>
  );
}
