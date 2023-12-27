import { AppRouter } from "./router/App.router";
import { AppContainer } from "./router/App.styles";
import { withAxiosIntercepted } from "./hooks/withAxiosIntercepted";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContextProvider } from "./context/UserContext";
import { createTheme, ThemeProvider } from "@mui/material";
// import { GREY, LILLA_LIGHT } from "./constants/colors";

const theme = createTheme({
    palette: {
        // secondary: {
            // main: LILLA_LIGHT,
        // },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <UserContextProvider>
                    <AppRouter />
                    <ToastContainer />
                </UserContextProvider>
            </AppContainer>
        </ThemeProvider>
    );
}

export default withAxiosIntercepted(App);
