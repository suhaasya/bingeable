import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { Inter } from "@next/font/google"
import Navbar from "../components/Navbar"
import { useUserData } from "../lib/hooks"
import { UserContext } from "../lib/context"
import Footer from "../components/Footer"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData()
  return (
    <main className={`${inter.className}`}>
      <UserContext.Provider value={userData}>
        <ChakraProvider>
          <Navbar />
          <section className="">
            <Component {...pageProps} />
          </section>
          <Footer />
        </ChakraProvider>
      </UserContext.Provider>
    </main>
  )
}
