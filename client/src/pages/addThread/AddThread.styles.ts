import styled from "styled-components";
import { ORANGE, WHITE1 } from "../../constants/colors";
import { LG, MD, SM } from "../../constants/constants";

export const MainContainer = styled.div`
    position: relative;
    height: 85vh;
    width: 100%;
    min-width: 375px;
    background-color: ${WHITE1};
`;

export const OrangeStripe = styled.div`
    width: 100%;
    min-width: 375px;
    height: 30vh;
    background-color: ${ORANGE};
`;

export const ContentsContainer = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 90%;
    // background-color: green;
`;

export const InnerContainer = styled.div`
    margin-top: 24px;
    width: 90%;

    display: grid;
    grid-template-areas: "left right";
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: ${MD}px) {
        grid-template-areas:
            "top"
            "down";

        justify-items: center;
        justify-content: center;
    }

    // background-color: grey;
`;

export const PhotoContainer = styled.div`
    width: 35vw;
    min-width: 240px;

    grid-area: right;

    @media (max-width: ${LG}px) {
        width: 40vw;
    }

    @media (max-width: ${MD}px) {
        grid-area: top;
        width: 60vw;
        margin-bottom: 24px;
    }

    @media (max-width: ${SM}px) {
        width: 63vw;
        margin-bottom: 24px;
    }

    // background-color: blue;
`;

export const InfoContainer = styled.div`
    width: 35vw;
    grid-area: left;

    @media (max-width: ${LG}px) {
        // width: 35w;
    }

    @media (max-width: ${MD}px) {
        grid-area: down;
        width: 60vw;
    }

    @media (max-width: ${SM}px) {
        width: 90%;
        min-width: 300px;
    }

    // background-color: green;
`;

export const ButtonsContainer = styled.div`
    margin-top: 48px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;

    // background-color: pink;
`;
