import BottomNavigation from "./BottomNavigation";
import Header from "./Header";

function Layout({ children }: { children?: JSX.Element | JSX.Element[] }) {
  return (
    <div className="container">
      <Header />
      {children}
      <BottomNavigation />
    </div>
  );
}

export default Layout;
