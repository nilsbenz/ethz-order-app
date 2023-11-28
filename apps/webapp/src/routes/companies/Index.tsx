import CompaniesList from "@/components/companies/CompaniesList";
import NewCompanyForm from "@/components/companies/NewCompanyForm";

export default function Companies() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="h1">Vereine</h2>
        <NewCompanyForm />
      </div>
      <CompaniesList />
    </div>
  );
}
