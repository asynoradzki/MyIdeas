import { Route, Routes } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Threads } from "../pages/threads/Threads";
import { Users } from "../pages/users/Users";
import { AddThread } from "../pages/addThread/AddThread";
import { Login } from "../pages/login/Login";
import { UnauthorizedRoute } from "../components/UnauthorizedRoute";
import { ProtectedRoute } from "../components/ProtectedRoute";
import MuiLogin from "../pages/login/MuiLogin";
import { Register } from "../pages/login/Register";
import { ForgotPassword } from "../pages/login/ForgotPassword";
import { ResetPassword } from "../pages/login/ResetPassword";
import { ChangePassword } from "../pages/login/ChangePassword";
import { EditThread } from "../pages/editThread/EditThread";
import { AddUser } from "../pages/users/AddUser";

export const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Navbar />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Threads />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="addUser"
                    element={
                        <ProtectedRoute>
                            <AddUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="addThread"
                    element={
                        <ProtectedRoute>
                            <AddThread />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="editThread/:id"
                    element={
                        <ProtectedRoute>
                            <EditThread />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path="/login"
                element={
                    <UnauthorizedRoute>
                        <Login />
                    </UnauthorizedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <UnauthorizedRoute>
                        <Register />
                    </UnauthorizedRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <UnauthorizedRoute>
                        <ForgotPassword />
                    </UnauthorizedRoute>
                }
            />
            <Route
                path="/reset-password/:token"
                element={
                    <UnauthorizedRoute>
                        <ResetPassword />
                    </UnauthorizedRoute>
                }
            />
            <Route
                path="/change-password"
                element={
                    <UnauthorizedRoute>
                        <ChangePassword />
                    </UnauthorizedRoute>
                }
            />

            {/* <Route
                path="/mui-login"
                element={
                    <UnauthorizedRoute>
                        <MuiLogin />
                    </UnauthorizedRoute>
                }
            /> */}
        </Routes>
    );
};
