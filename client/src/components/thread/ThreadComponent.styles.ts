import styled from "styled-components";
import { LG, MD, SM } from "../../constants/constants";

export const MainContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: blue;
`;

export const ContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    // background-color: yellow;
`;

export const InnerContainer = styled.div`
    margin-top: 32px;
    width: 90%;
    // min-width: 300px;

    display: grid;
    grid-template-areas: "left center right";
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: ${MD}px) {
        grid-template-areas:
            "left right"
            "down down";

        justify-content: center;
    }

    // background-color: grey;
`;

export const VoteContainer = styled.div`
    grid-area: left;

    // background-color: red;
`;

export const PhotoContainer = styled.div`
    width: 35vw;
    min-width: 240px;

    grid-area: right;

    @media (max-width: ${LG}px) {
        width: 40vw;
    }

    @media (max-width: ${MD}px) {
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
    grid-area: center;

    @media (max-width: ${LG}px) {
        width: 30vw;
    }

    @media (max-width: ${MD}px) {
        grid-area: down;
        width: 100%;
    }

    @media (max-width: ${SM}px) {
        grid-area: down;
        width: 100%;
        min-width: 300px;
    }

    // background-color: green;
`;

export const ButtonsContainer = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;
