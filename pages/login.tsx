import { Button, Input } from "@chakra-ui/react"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineGoogle } from "react-icons/ai"
import { auth } from "../lib/firebaseConfig"

function LoginPage() {
  return <LoginForm />
}

export default LoginPage

function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        router.push("/")
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  }

  return (
    <form
      className="text-center flex flex-col items-center gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className=" text-6xl font-bold logo mt-8">Bingeable</h1>
      <p>Sign in to continue</p>
      <Button size={"lg"} width={64}>
        {" "}
        <span>
          <AiOutlineGoogle size={"1.5em"} />{" "}
        </span>{" "}
        <span className="text-sm">Continue with Google</span>
      </Button>

      <p className="my-2">or</p>

      <Input
        width={64}
        placeholder={"Email Address"}
        name="email"
        onChange={handleChange}
      />
      <Input
        width={64}
        placeholder={"Password"}
        name="password"
        onChange={handleChange}
        type="password"
      />

      <Button
        type="submit"
        width={64}
        size="lg"
        disabled={formData.email === "" || formData.password === ""}
      >
        <span className="text-sm">Sign Up</span>
      </Button>
      <p>
        Don't have an account?{" "}
        <Link href={"/signup"}>
          <span className="underline">Sign up</span>
        </Link>
      </p>
    </form>
  )
}
