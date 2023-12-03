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
      <div className="fixed bottom-0 left-0 right-0 flex flex-col border-t border-border sm:flex-row-reverse">
        <div
          className={cn(
            "grid h-16 flex-grow place-items-center bg-background/80 px-4 backdrop-blur",
            className
          )}
        >
          {children}
        </div>
        <div className="mb-[var(--safe-area-bottom)] h-[var(--nav-height)] w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]" />
      </div>
      <div className="mb-[var(--safe-area-bottom)] mt-12 h-[var(--nav-height)] w-full sm:h-0 sm:max-w-[5rem] lg:max-w-[12rem]" />
    </>
  );
}
