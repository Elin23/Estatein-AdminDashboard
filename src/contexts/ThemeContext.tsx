import { useEffect } from "react"
import { useAppSelector } from "../hooks/useAppSelector"

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useAppSelector((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <>{children}</>
}
