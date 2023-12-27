import { Outlet, useNavigate } from "react-router-dom";
import {
    IconLink,
    LogoutButton,
    NavbarContainer,
    NavbarLink,
    NavbarLinks,
    NavbarRightBox,
    WelcomeText,
} from "./Navbar.styles";
import { NavbarIcon } from "./Navbar.styles";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { ACCESS_TOKEN } from "../../constants/constants";
import { handleLogout } from "../../auth_helpers/authHelpers";

export const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, userModifier } = useContext(UserContext);

    const handleOnLogoutClick = async () => {
        const jwtToken: string | null = localStorage.getItem(ACCESS_TOKEN);
        if (jwtToken) {
            await handleLogout(jwtToken);
            userModifier(null);
        }
        navigate("/login");
    };

    return (
        <>
            <NavbarContainer>
                <IconLink to={"/"} style={{}}>
                    <NavbarIcon />
                </IconLink>
                <NavbarLinks>
                    <NavbarLink to={"/addThread"}>ADD</NavbarLink>
                    <NavbarLink to={"/"}>IDEAS</NavbarLink>
                    <NavbarLink to={"/users"}>USERS</NavbarLink>
                </NavbarLinks>
                <NavbarRightBox>
                    <WelcomeText>{currentUser ? `Welcome, ${currentUser.name}` : ""}</WelcomeText>
                    <LogoutButton onClick={handleOnLogoutClick}>LOG OUT</LogoutButton>
                </NavbarRightBox>
            </NavbarContainer>
            <Outlet />
        </>
    );
};
