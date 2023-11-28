export default function TableView({ children }: { children?: JSX.Element[] }) {
  return (
    <div className="-mx-1 flex flex-col divide-y rounded-lg border border-border bg-card py-1 pl-3 pr-1 transition-[background-color] md:-mx-4 md:px-4">
      {children}
    </div>
  );
}
