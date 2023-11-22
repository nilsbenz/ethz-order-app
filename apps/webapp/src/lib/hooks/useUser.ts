import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getClaims, userLevelFromClaims } from "../auth";
import { auth } from "../firebase";
import { USER_CLAIMS_QUERY } from "../queries";
import useAuthStore from "../store/auth";

export default function useUser() {
  const { user, setUser, setUserLevel } = useAuthStore();

  const { data: userLevel } = useQuery({
    queryKey: [USER_CLAIMS_QUERY, user?.uid],
    queryFn: () => getClaims(user ?? undefined),
    select: (data) => userLevelFromClaims(data),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUserLevel(userLevel);
  }, [userLevel]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setUser(user ?? null)
    );

    return unsubscribe;
  }, []);
}
