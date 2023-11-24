import CompaniesList from "@/components/admin/CompaniesList";
import NewCompanyForm from "@/components/admin/NewCompanyForm";
import NewSuperAdminForm from "@/components/admin/NewSuperAdminForm";
import SuperAdminsList from "@/components/admin/SuperAdminsList";

export default function Admin() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Admin</h2>

      <div className="flex justify-between">
        <h3 className="h2">Super Admins</h3>
        <NewSuperAdminForm />
      </div>
      <SuperAdminsList />

      <div className="mt-8 flex justify-between">
        <h3 className="h2">Companies</h3>
        <NewCompanyForm />
      </div>
      <CompaniesList />
    </div>
  );
}
