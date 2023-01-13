import { Button, Input, Textarea, useToast } from "@chakra-ui/react"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { useContext, useState } from "react"
import InputFile from "../../components/InputFile"
import { UserContext } from "../../lib/context"
import { auth, db, getUserWithUsername } from "../../lib/firebaseConfig"

type UserTypes = {
  username: string
  briefBio: string
  photoURL: string
  displayName: string
}

type AccountPagePropTypes = {
  accountUser: UserTypes
}

function AccountPage({ accountUser }: AccountPagePropTypes) {
  const toast = useToast()
  const { userId, user } = useContext(UserContext)
  const [userData, setUserData] = useState(accountUser)

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value.toLowerCase() }))
  }

  const handleSubmit = async () => {
    const userRef = doc(db, "users", userId)

    await updateDoc(userRef, { ...userData })
  }

  const uploadProfile = async (img: string) => {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { ...userData, photoURL: img }).then((res) =>
      console.log(res)
    )
    updateProfile(user, {
      photoURL: img,
    })
    toast({
      title: "Profile Picture Updated",
      description: "We've update profile picture",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <main>
      <h1 className="logo text-6xl font-bold mb-8">Account</h1>
      <section className="md:flex gap-8">
        <div className="bg-white p-8 h-1/4">
          <h4 className="mb-8">Profile Picture</h4>
          <InputFile updateImage={uploadProfile} img={userData.photoURL} />
        </div>
        <div className="border border-solid border-black flex-1 p-8 flex flex-col gap-2">
          <h4> Profile</h4>{" "}
          <p>This information will be displayed on your profile page.</p>
          <label htmlFor="">Display Name</label>
          <Input
            value={userData.displayName}
            onChange={handleChange}
            name="displayName"
          />
          <label htmlFor="">Username</label>
          <Input
            value={userData.username}
            onChange={handleChange}
            name="username"
            disabled
          />
          <label htmlFor="">Bio</label>
          <Textarea
            value={userData.briefBio}
            onChange={handleChange}
            name={"briefBio"}
          />
          <p>Brief Description of your profile</p>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </section>
    </main>
  )
}
type getServerSidePropsTypes = {
  query: any
}
export async function getServerSideProps({ query }: getServerSidePropsTypes) {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  // JSON serializable data
  let accountUser = null

  if (userDoc) {
    accountUser = { uid: userDoc.id, ...userDoc.data() }
  }

  return {
    props: { accountUser }, // will be passed to the page component as props
  }
}

export default AccountPage
