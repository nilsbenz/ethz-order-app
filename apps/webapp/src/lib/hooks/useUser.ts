import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { Collection } from "../collections";
import { auth, db } from "../firebase";
import { appUserConverter } from "../model/users";
import useAuthStore from "../store/auth";

export default function useUser() {
  const { user, setUser, setUserData } = useAuthStore();

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
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setUser(user ?? null)
    );

    return unsubscribe;
  }, []);
}
