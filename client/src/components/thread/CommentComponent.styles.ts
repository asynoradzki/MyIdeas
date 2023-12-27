import styled from "styled-components";
import { LG, MD, SM } from "../../constants/constants";

const BasicFlexColumn = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const MainContainer = styled(BasicFlexColumn)`
    gap: 32px;
    // background-color: grey;
`;

export const ContentsContainer = styled(BasicFlexColumn)`
    align-items: start;
    gap: 24px;
    width: 50%;

    @media (max-width: ${LG}px) {
        60%
    }

    @media (max-width: ${MD}px) {
        width: 70%;
    }

    @media (max-width: ${SM}px) {
        width: 80%;
    }

    // background-color: purple;
`;
