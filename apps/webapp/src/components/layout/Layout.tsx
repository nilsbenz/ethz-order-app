import BottomNavigation from "./BottomNavigation";

function Layout({ children }: { children?: JSX.Element | JSX.Element[] }) {
  return (
    <div className="container">
      {children}
      <BottomNavigation />
    </div>
  );
}

export default Layout;
