import { cn } from "@order-app/ui";

export default function BottomAction({
  children,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex flex-col border-t border-border transition-[border-color] sm:flex-row-reverse">
        <div
          className={cn(
            "grid h-16 flex-grow place-items-center bg-background/80 px-4 backdrop-blur transition-[background-color] dark:bg-card/80",
            className
          )}
        >
          {children}
        </div>
        <div className="mb-[var(--safe-area-bottom)] h-[var(--nav-height)] w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]" />
      </div>
      <div className="h-12 w-full sm:mb-[var(--safe-area-bottom)]" />
    </>
  );
}
