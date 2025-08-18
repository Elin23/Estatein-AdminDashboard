import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database"
import LoginContainer from "../components/auth/LoginContainer"
import LoginHeader from "../components/auth/LoginHeader"
import LoginForm from "../components/auth/LoginForm"
import { loginSuccess } from "../redux/slices/authSlice"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const auth = getAuth()
  const db = getDatabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const uid = userCredential.user.uid
      console.log("Logged in UID:", uid)

      const roleRef = ref(db, `users/${uid}`)
      const snapshot = await get(roleRef)

      if (!snapshot.exists()) {
        console.warn("No user data found in Realtime Database for this UID")
        setError("Your account information is no longer available. Please contact support.")
        return
      }

      const userData = snapshot.val()
      console.log("User data from Realtime Database:", userData)

      if (!userData.role) {
        console.warn("Role is missing in user data")
        setError("Your account information is no longer available. Please contact support.")
        return
      }

      dispatch(loginSuccess({ email, role: userData.role }))
      navigate("/")

    } catch (err: any) {
      console.error("Login error:", err)

      if (err.code === "auth/invalid-credential") {
        setError("The email or password you entered is incorrect. Please try again.")
      } else {
        setError("Unable to log in. Please try again or contact support.")
      }
    }
  }

  return (
    <LoginContainer>
      <LoginHeader isLogin={true} />
      <LoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      {error && (
        <div className="mt-4 text-red-600 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
    </LoginContainer>
  )
}

export default Login
