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
    gap: 24px;
    // background-color: purple;

    width: 50%;
    margin-top: 32px;

    @media (max-width: ${LG}px) {
        60%
    }

    @media (max-width: ${MD}px) {
        width: 70%;
    }

    @media (max-width: ${SM}px) {
        width: 80%;
    }
`;
