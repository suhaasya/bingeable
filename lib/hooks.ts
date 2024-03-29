import { auth, db } from "../lib/firebaseConfig"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, onSnapshot } from "firebase/firestore"

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (user) {
      const ref = doc(db, "users", user.uid)
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username)
      })
      setUserId(user?.uid)
    } else {
      setUsername(null)
    }

    return unsubscribe
  }, [user])

  return { user, username, userId }
}
