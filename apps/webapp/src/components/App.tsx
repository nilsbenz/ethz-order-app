import useTheme from "@/lib/hooks/useTheme";
import useUser from "@/lib/hooks/useUser";
import useAuthStore from "@/lib/store/auth";
import { Loader2Icon } from "lucide-react";
import { useDebounce } from "usehooks-ts";

export default function App({ children }: { children?: JSX.Element[] }) {
  useUser();
  useTheme();

  const userFetched = useAuthStore(
    (state) =>
      state.user === null || (!!state.user && state.userData !== undefined)
  );
  const debouncedUserFetched = useDebounce(userFetched, 200);

  if (!debouncedUserFetched) {
    return (
      <div className="grid min-h-[100dvh] place-items-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <img src="/icon.svg" className="aspect-square w-40" />
          <Loader2Icon className="animate-spin" strokeWidth={3} />
        </div>
      </div>
    );
  }

  return children ?? null;
}
