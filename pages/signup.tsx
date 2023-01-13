import { Button, Input } from "@chakra-ui/react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineGoogle } from "react-icons/ai"
import { auth } from "../lib/firebaseConfig"

function SignUpPage() {
  return (
    <main className="text-center flex flex-col items-center gap-4">
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

      <SignUpForm />
      <p>
        Already have an account?{" "}
        <Link href={"/login"}>
          <span className="underline">Log in</span>
        </Link>
      </p>
    </main>
  )
}

export default SignUpPage

function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const isValid = formData.email !== "" && formData.password !== ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // ...
        router.push("/welcome")
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
        console.log(errorCode)
        console.log(errorMessage)
      })

    setFormData({
      email: "",
      password: "",
    })
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        width={64}
        placeholder={"Email Address"}
        name="email"
        onChange={handleChange}
        value={formData.email}
      />
      <Input
        width={64}
        placeholder={"Password"}
        type={"password"}
        name="password"
        onChange={handleChange}
        value={formData.password}
      />

      <Button width={64} size="lg" type="submit" disabled={!isValid}>
        <span className="text-sm">Sign Up</span>
      </Button>
    </form>
  )
}
