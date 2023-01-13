import { doc, getDoc } from "firebase/firestore"
import { db, getUserWithUsername, postToJSON } from "../../lib/firebaseConfig"
import PostTypes from "../../lib/types/post.types"

type getServerSidePropsTypes = {
  query: any
}

type ListPagePropTypes = {
  post: PostTypes
}

export async function getServerSideProps({
  query: queryParams,
}: getServerSidePropsTypes) {
  const { username, slug } = queryParams

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  // JSON serializable data
  let post

  if (userDoc) {
    const postRef = doc(db, "users", userDoc.id, "posts", slug)

    const docSnap = await getDoc(postRef)

    if (docSnap.exists()) {
      post = postToJSON(docSnap)
    }
  }

  return {
    props: { post },
  }
}

export default function ListPage({ post }: ListPagePropTypes) {
  return (
    <main>
      <h3>{post.title}</h3>
      <h3>{post.description}</h3>
    </main>
  )
}
