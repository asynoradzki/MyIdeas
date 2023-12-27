import styled from "styled-components";
import { GREY_LIGHT, ORANGE, WHITE1 } from "../../constants/colors";

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
