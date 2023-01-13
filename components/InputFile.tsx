import { Avatar, Button, Spinner } from "@chakra-ui/react"
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage"
import Image from "next/image"
import { useContext, useState } from "react"
import { UserContext } from "../lib/context"
import { storage } from "../lib/firebaseConfig"

type InputFileTypes = {
  img?: string
  updateImage: any
}

function InputFile({ img, updateImage }: InputFileTypes) {
  const { userId } = useContext(UserContext)
  const [image, setImage] = useState<string | any>(img)
  const [showLoader, setShowLoader] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files || [])[0]
    const extension = file.type.split("/")[1]

    const imgRef = ref(storage, `uploads/${userId}/${Date.now()}.${extension}`)
    setShowLoader(true)
    const uploadTask = uploadBytesResumable(imgRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log("Upload is " + progress + "% done")
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused")
            break
          case "running":
            console.log("Upload is running")
            break
        }
      },
      (error) => {
        console.error(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL)
          setShowLoader(false)
        })
      }
    )
  }

  return (
    <label className="label flex flex-col gap-2 items-center justify-center border border-black border-dotted">
      <div className="text-center">
        <input
          type="file"
          required
          onChange={handleChange}
          className={`${image && "hidden"}`}
          accept="image/x-png,image/gif,image/jpeg"
        />
        {image && showLoader ? (
          <Spinner size={"xl"} />
        ) : (
          <Avatar src={image} size={"2xl"} />
        )}
        <span className={`${image && "hidden"}`}>
          Drop your image here, or click to browse.
        </span>
      </div>
      {image && <Button onClick={() => updateImage(image)}>Save</Button>}
    </label>
  )
}

export default InputFile
