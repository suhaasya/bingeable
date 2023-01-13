import {
  Avatar,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { signOut } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { UserContext } from "../lib/context"
import { auth } from "../lib/firebaseConfig"

function Navbar() {
  const router = useRouter()
  const { user, username } = useContext(UserContext)

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/")
      })
      .catch((error) => {
        // An error happened.
      })
  }

  const { pathname } = router

  return (
    <nav className="border-b border-solid border-black">
      <ul className="flex  gap-4 md:gap-8 m-4 items-center xl:max-w-screen md:w-5/6 md:mx-auto">
        <Link href={"/"}>
          <li className="text-4xl logo font-bold">Bingeable</li>
        </Link>
        <li className="hidden lg:block">
          <Input
            placeholder="Search for movies and people"
            size="md"
            width={72}
          />
        </li>
        <li className="ml-auto cursor-pointer">
          <Link href={"/people"}>People</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={"/movies"}>Movies</Link>
        </li>
        {username && (
          <li className="cursor-pointer">
            <Link href={`/${username}`}>{username}</Link>
          </li>
        )}
        {user ? (
          <li>
            <Menu>
              <MenuButton>
                <Avatar
                  name={user?.displayName}
                  src={user?.photoURL !== "" && user?.photoURL}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push(`/${username}`)}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => router.push(`${username}/account`)}>
                  Settings
                </MenuItem>
                <MenuItem onClick={signOutUser}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </li>
        ) : (
          <li className="cursor-pointer">
            {pathname === "/login" ? (
              <Link href={"/signup"}>Sign Up</Link>
            ) : (
              <Link href={"/login"}>Login</Link>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
