import { RouterProvider } from "react-router-dom"
// import { ThemeProvider } from './contexts/ThemeContext';

import router from "./router"
import ThemeProvider from "./contexts/ThemeContext"
import { SidebarProvider } from "./contexts/SidebarContext"

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
