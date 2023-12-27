import { Link } from "react-router-dom";
import styled from "styled-components";
import IdeasIcon from "../../icons/IdeasIcon";
import { BLACK, WHITE } from "../../constants/colors";
import { MD, SM } from "../../constants/constants";

export const NavbarContainer = styled.div`
    display: grid;
    grid-template-areas:
        "left right"
        "down down";
    align-items: center;
    // grid-gap: 10px;
    background-color: ${BLACK};

    height: 15vh;
    min-width: 375px;

    @media (max-width: ${MD}px) {
        grid-template-areas:
            "left right"
            "down down";
        height: auto;
    }

    @media (max-width: ${SM}px) {
        grid-template-areas:
            "top"
            "center"
            "down";
    }
`;

export const IconLink = styled(Link)`
    grid-area: left;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 160px;
    order: 1;

    @media (max-width: ${MD}px) {
        grid-area: left;
    }

    @media (max-width: ${SM}px) {
        margin-top: 16px;
        grid-area: top;
    }
`;

export const NavbarIcon = styled(IdeasIcon)`
    width: 120px;
`;

export const NavbarLinks = styled.div`
    grid-area: down;
    place-self: center;

    display: flex;
    flex-direction: row;
    gap: 40px;
    // background-color: grey;
    margin: 0 20px;
    order: 2;

    @media (max-width: ${MD}px) {
        grid-area: down;
    }

    @media (max-width: ${SM}px) {
        grid-area: down;
    }
`;

export const NavbarLink = styled(Link)`
    text-decoration: none;
    color: #ffffff;
    font-size: 18px;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const NavbarRightBox = styled.div`
    grid-area: right;
    justify-self: end;
    margin-right: 16px;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 24px;
    // background-color: grey;
    order: 3;

    @media (max-width: ${MD}px) {
        grid-area: right;
        
    }

    @media (max-width: ${SM}px) {
        grid-area: center;
    }
`;

export const WelcomeText = styled.h6`
    color: ${WHITE};
    font-size: 16px;
    // width: min-content;

    @media (max-width: ${MD}px) {
        // width: auto;
    }
`;

export const LogoutButton = styled.button`
    background-color: #ff8900;
    border-radius: 38px;
    border: none;
    width: 113px;
    height: 32px;
    font-family: "Poppins Light", sans-serif;
    font-weight: bold;
    color: ${WHITE};

    &:hover {
        background-color: ${WHITE};
        color: ${BLACK};
        cursor: pointer;
        font-weight: bold;
    }
`;
