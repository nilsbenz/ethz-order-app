import Header from "./Header";
import Navigation from "./Navigation";

function Layout({ children }: { children?: JSX.Element | JSX.Element[] }) {
  return (
    <>
      <Header />
      <div className="flex flex-col sm:flex-row-reverse">
        <div className="container mx-auto w-full max-w-xl py-8">{children}</div>
        <Navigation />
      </div>
    </>
  );
}

export default Layout;
