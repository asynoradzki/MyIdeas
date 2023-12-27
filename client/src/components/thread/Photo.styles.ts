import styled from "styled-components";
import { LG, MD, SM } from "../../constants/constants";

export const PhotoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
    // min-width: 320px;
    // background-color: yellow;

    width: 100%;

    // width: 300px;

    // @media (max-width: ${LG}px) {
    //     width: 480px;
    // }

    // @media (max-width: ${MD}px) {
    //     width: 480px;
    // }

    // @media (max-width: ${SM}px) {
    //     width: 100%;
    // }
`;

export const ResponsiveImage = styled.img`
    margin: 0;
    border-radius: 10px;
    width: 100%;
    // background-color: red;
`;
