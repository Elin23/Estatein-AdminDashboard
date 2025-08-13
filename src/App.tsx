import { RouterProvider } from "react-router-dom"
// import { ThemeProvider } from './contexts/ThemeContext';

import router from "./router"
import ThemeProvider from "./contexts/ThemeContext"
import { SidebarProvider } from "./contexts/SidebarContext"
import { useAppDispatch } from "./hooks/useAppSelector";
import { useEffect } from "react";
import { listenToLocations } from "./redux/slices/locationSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listenToLocations());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
