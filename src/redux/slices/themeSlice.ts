import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

const initialState: Theme = (localStorage.getItem("theme") as Theme) || "light";

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(_, action: PayloadAction<Theme>) {
            localStorage.setItem("theme", action.payload);
            return action.payload;
        },
        toggleTheme(state) {
            const newTheme = state === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
