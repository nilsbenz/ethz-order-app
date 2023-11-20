import useTheme from "@/lib/hooks/useTheme";
import useUser from "@/lib/hooks/useUser";
import useAuthStore from "@/lib/store/auth";
import { Loader2Icon } from "lucide-react";
import { useDebounce } from "usehooks-ts";

export default function App({ children }: { children: JSX.Element }) {
  useUser();
  useTheme();

  const user = useAuthStore((state) => state.user);
  const debouncedUser = useDebounce(user, 200);

  if (debouncedUser === undefined) {
    return (
      <div className="grid min-h-[100dvh] place-items-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <img src="/icon.svg" className="w-40" />
          <Loader2Icon className="animate-spin" strokeWidth={3} />
        </div>
      </div>
    );
  }

  return children;
}
