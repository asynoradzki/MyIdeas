import styled from "styled-components";
import { LILLA_LIGHT2 } from "../../constants/colors";
import { LG, MD, SM } from "../../constants/constants";

export const SearchContentsContainer = styled.div`
    position: absolute;
    top: 100px;
    width: 500px;
    // margin-top: 100px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: start;

    // @media (max-width: ${LG}px) {
    //     width: 500px;
    // }

    @media (max-width: ${MD}px) {
        width: 400px;
    }

    @media (max-width: ${SM}px) {
        width: 300px;
    }

    // background-color: blue;
`;

export const SearchWindowContainer = styled.div`
    width: 100%;

    // background-color: yellow;
`;

export const SearchResultsContainer = styled.div`
    width: 100%;
    border-radius: 0 0 4px 4px;

    background-color: ${LILLA_LIGHT2};
    // background-color: #e5d8ea;
`;
