import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react"
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore"
import { Router, useRouter } from "next/router"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import capitalize from "../../lib/capitalize"
import { UserContext } from "../../lib/context"
import { db, getUserWithUsername, postToJSON } from "../../lib/firebaseConfig"
import kebabCase from "lodash.kebabcase"
import UserTypes from "../../lib/types/user.types"
import PostTypes from "../../lib/types/post.types"
import ListBox from "../../components/ListBox"
import Link from "next/link"
import debounce from "lodash.debounce"

type getServerSidePropsTypes = {
  query: any
}

type UserProfilePagePropTypes = {
  user: UserTypes
  posts: PostTypes[]
}

export async function getServerSideProps({
  query: queryParams,
}: getServerSidePropsTypes) {
  const { username } = queryParams

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  // JSON serializable data
  let user = null
  const posts: any[] = []

  if (userDoc) {
    user = { uid: userDoc.id, ...userDoc.data() }

    const postsQuery = query(
      collection(db, "users", userDoc.id, "posts"),
      orderBy("createdAt", "desc")
    )

    const querySnapshot = await getDocs(postsQuery)

    querySnapshot.forEach((doc) => {
      posts.push(postToJSON(doc))
    })
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  }
}

export default function UserProfilePage(props: UserProfilePagePropTypes) {
  const { user, posts } = props
  const { userId } = useContext(UserContext)
  const router = useRouter()

  console.log(posts)

  return (
    <main>
      <div className="flex gap-4 my-12 m-4 xl:max-w-screen md:w-5/6 md:mx-auto">
        <Avatar size={"2xl"} src={user?.photoURL} />
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl font-bold">
            {capitalize(user.displayName)}{" "}
            {user.uid === userId && (
              <Button
                size={"xs"}
                onClick={() => router.push(`/${user.username}/account`)}
              >
                Edit Profile
              </Button>
            )}
          </h3>
          <p>@{user.username}</p>
          <p>{user.briefBio}</p>
        </div>
      </div>

      <section className="bg-light_gray py-8">
        <div className="m-4 xl:max-w-screen md:w-5/6 md:mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {user.uid === userId && <ListCreator />}
          {posts.map((post) => (
            <Link href={`${post.username}/${post.slug}`} key={post.slug}>
              <ListBox title={post.title} key={post.slug} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function ListCreator() {
  const { userId, username } = useContext(UserContext)
  const [listData, setListData] = useState({ title: "", description: "" })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const router = useRouter()
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setListData((prev) => ({ ...prev, [name]: value }))
  }

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(listData.title))

  const createNewPost = () => {
    const docRef = doc(db, "users", userId, "posts", slug)
    const data = {
      ...listData,
      slug,
      uid: userId,
      username,
      contentList: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    setDoc(docRef, data)
    router.push(`${username}/${slug}`)
  }

  const checkSlug = useCallback(
    debounce(async (slug: string) => {
      if (slug.length >= 3) {
        setLoading(true)
        const ref = doc(db, "users", userId, "posts", slug)
        const snap = await getDoc(ref)
        console.log("Firestore read executed!")

        setIsValid(!snap.exists())
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkSlug(slug)
  }, [slug, checkSlug])

  return (
    <div className="h-48  flex items-center justify-center border border-solid border-gray cursor-pointer bg-white">
      <div className="flex flex-col items-center" onClick={onOpen}>
        <AiOutlinePlus size={"3rem"} />
        <p>Create a new list</p>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a List</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                onChange={handleChange}
                name={"title"}
              />
              <p>
                {username}/{slug}{" "}
                <SlugMessage slug={slug} isValid={isValid} loading={loading} />
              </p>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description"
                onChange={handleChange}
                name="description"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" disabled={!isValid} onClick={createNewPost}>
              Create List
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

type SlugMessageTypes = {
  slug: string
  isValid: Boolean
  loading: Boolean
}

function SlugMessage({ slug, isValid, loading }: SlugMessageTypes) {
  if (loading) {
    return (
      <span>
        <span>
          <Spinner size={"sm"} />{" "}
        </span>
        <span>Checking...</span>
      </span>
    )
  } else if (isValid) {
    return <span className="text-green"> is available!</span>
  } else if (slug && !isValid) {
    return <span className="text-red"> is exists!</span>
  } else {
    return <span></span>
  }
}
