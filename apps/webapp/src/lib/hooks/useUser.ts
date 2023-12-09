import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { Collection } from "../collections";
import { auth, db } from "../firebase";
import { appUserConverter } from "../model/users";
import useAuthStore from "../store/auth";

export default function useUser() {
  const { user, userData, setUser, setUserData } = useAuthStore();
  const [refetch, setRefetch] = useState(0);

  useInterval(
    () => setRefetch((prev) => prev + 1),
    user && !userData ? 1000 : null
  );

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, Collection.Users, user.uid).withConverter(appUserConverter),
        (snapshot) => {
          const data = snapshot.data();
          setUserData(data);
        }
      );

      return unsubscribe;
    } else {
      setUserData(undefined);
    }
  }, [user?.uid, refetch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setUser(user ?? null)
    );

    return unsubscribe;
  }, []);
}
