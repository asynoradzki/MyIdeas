import styled from "styled-components";
import { MD, SM } from "../../constants/constants";

export const ButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    // background-color: grey;
`;

export const UserDataContainer = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-top: 200px;

    @media (max-width: ${MD}px) {
        width: 400px;
    }

    @media (max-width: ${SM}px) {
        width: 300px;
    }

    // background-color: blue;
`;
