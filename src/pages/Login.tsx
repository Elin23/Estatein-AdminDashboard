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
        setError("Role not found for this user")
        return
      }

      const userData = snapshot.val()
      console.log(" User data from Realtime Database:", userData)

      if (!userData.role) {
        console.warn(" Role is missing in user data")
        setError("Role is missing for this user")
        return
      }

      dispatch(loginSuccess({ email, role: userData.role }))

      navigate("/")
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.code === "auth/user-not-found") {
        setError("User not found")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else {
        setError(err.message || "Failed to login")
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
