import styled from "styled-components";

const BasicFlexColumn = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BasicFlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const MainContainer = styled(BasicFlexColumn)`
    gap: 32px;
`;

export const ContentsContainer = styled(BasicFlexColumn)`
    gap: 24px;
`;

export const InfoContainer = styled(BasicFlexRow)`
    gap: 8px;
    justify-content: start;
    flex-wrap: wrap;
`;

export const ButtonsContainer = styled(BasicFlexRow)`
    justify-content: center;
    gap: 16px;
    // background-color: grey;
`;
