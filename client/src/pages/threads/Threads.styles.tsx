import styled from "styled-components";
import { ORANGE, WHITE1 } from "../../constants/colors";

export const MainContainer = styled.div`
    position: relative;
    background: ${WHITE1};
    height: 85vh;
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
    width: min-content;
    min-width: 375px;
`;

export const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 16px;
`;
