import { CloudIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-30 border-b border-border/50 bg-muted/80 px-4 backdrop-blur"
        style={{
          paddingTop: "max(0, calc(env(safe-area-inset-top) - 0.25rem))",
        }}
        ref={headerRef}
      >
        <div className="flex h-14 items-center gap-2">
          <CloudIcon className="h-8 w-8" strokeWidth={2.25} />
          <h1 className="text-xl font-medium">bstell.online</h1>
        </div>
      </header>
      <div
        className="w-full"
        style={{
          height: `${headerHeight}px`,
        }}
      />
    </>
  );
}

export default Header;
