import { Button, Input, Spinner, Textarea } from "@chakra-ui/react"
import { doc, getDoc, getDocs, writeBatch } from "firebase/firestore"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { UserContext } from "../lib/context"
import { db } from "../lib/firebaseConfig"
import debounce from "lodash.debounce"
import { useRouter } from "next/router"

function WelcomePage() {
  return (
    <main className="flex items-center justify-center h-[75vh] ">
      <div className="flex flex-col gap-4 mx-4 md:mx-auto">
        <h1 className="text-xl text-center">Welcome to Bingeable 👋</h1>
        <p className="text-center">
          First things first, tell us a bit about yourself.
        </p>
        <WelcomeForm />
      </div>
    </main>
  )
}

function WelcomeForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    briefBio: "",
  })
  const [userNameValue, setUserNameValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useContext(UserContext)

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target

    setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }))

    if (name === "userName") {
      const val = value.toLowerCase()
      const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

      // Only set form value if length is < 3 OR it passes regex
      if (val.length < 3) {
        setUserNameValue(val)
        setLoading(false)
        setIsValid(false)
      }

      if (re.test(val)) {
        setUserNameValue(val)
        setLoading(true)
        setIsValid(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userDoc = doc(db, `users`, user.uid)
    const userNameDoc = doc(db, `usernames`, userNameValue)

    const batch = writeBatch(db)

    batch.set(userDoc, {
      username: userNameValue,
      briefBio: formData.briefBio,
      photoURL: "",
      displayName: `${formData.firstName} ${formData.lastName}`,
    })
    batch.set(userNameDoc, { uid: user.uid })

    await batch.commit()
    router.push(`${userNameValue}`)
  }

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = doc(db, "usernames", username)
        const snap = await getDoc(ref)
        console.log("Firestore read executed!")

        setIsValid(!snap.exists())
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(userNameValue)
  }, [userNameValue, checkUsername])

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          placeholder="First Name *"
          name="firstName"
          onChange={handleChange}
        />
        <Input
          placeholder="Last Name *"
          name="lastName"
          onChange={handleChange}
        />
      </div>
      <Input placeholder="Username *" name="userName" onChange={handleChange} />
      <UsernameMessage
        username={userNameValue}
        isValid={isValid}
        loading={loading}
      />
      <Textarea
        placeholder="Brief Bio *"
        name="briefBio"
        onChange={handleChange}
      />

      <Button
        size={"lg"}
        type="submit"
        disabled={
          !isValid ||
          formData.firstName === "" ||
          formData.lastName === "" ||
          formData.briefBio === ""
        }
      >
        Submit
      </Button>
    </form>
  )
}

export default WelcomePage
type UsernameMessageTypes = {
  username: String
  isValid: Boolean
  loading: Boolean
}

function UsernameMessage({ username, isValid, loading }: UsernameMessageTypes) {
  if (loading) {
    return (
      <div>
        <span>
          <Spinner size={"sm"} />{" "}
        </span>
        <span>Checking...</span>
      </div>
    )
  } else if (isValid) {
    return <p className="text-green">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-red">That username is taken!</p>
  } else {
    return <p></p>
  }
}
