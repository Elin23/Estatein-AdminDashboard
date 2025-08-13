import { RouterProvider } from "react-router-dom"
// import { ThemeProvider } from './contexts/ThemeContext';

import router from "./router"
import ThemeProvider from "./contexts/ThemeContext"
import { SidebarProvider } from "./contexts/SidebarContext"
import { useAppDispatch } from "./hooks/useAppSelector";
import { useEffect } from "react";
import { subscribeToSubmissions } from "./redux/slices/submissionsSlice";
import { subscribeToProperties } from "./redux/slices/propertiesSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToSubmissions()); 
    dispatch(subscribeToProperties());
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
