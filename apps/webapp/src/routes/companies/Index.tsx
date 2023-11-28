import CompaniesList from "@/components/admin/CompaniesList";
import NewCompanyForm from "@/components/admin/NewCompanyForm";

export default function Companies() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-8 flex items-center justify-between">
        <h2 className="h1">Companies</h2>
        <NewCompanyForm />
      </div>
      <CompaniesList />
    </div>
  );
}
