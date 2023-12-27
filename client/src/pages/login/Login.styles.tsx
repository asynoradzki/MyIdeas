import styled from "styled-components";
import IdeasIcon from "../../icons/IdeasIcon";
import { Link } from "react-router-dom";
import { BLACK, ORANGE, WHITE } from "../../constants/colors";

export const StyledHeading = styled.span`
    font-size: 36px;
    font-weight: 600;
    margin-top: 32px;
    margin-bottom: 8px;
`;

export const LoginPageContainer = styled.div`
    height: 100vh;
    width: 100vw;
`;

export const LoginBrandingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 400px;
    min-height: 150px;
    height: 33%;
    width: 100%;
`;

export const LoginIdeasIcon = styled(IdeasIcon)`
    min-width: 300px;
    height: 70%;
`;

export const LoginContainer = styled.div`
    width: 100%;
    min-width: 400px;
    min-height: 67%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: ${ORANGE};
`;

export const LoginInputContainer = styled.div<{ $isVisible?: boolean }>`
    margin: 30px 0;
    // display: ${(props) => (props.$isVisible ? "flex" : "none")};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    max-width: 1000px;

    @media (min-width: 920px) {
        height: 360px;
        min-width: 900px;
    }
`;

// Colors.ts
// export const Primary = '#F20316'
// export const Primary50 = '#FEE6E8'
// color: ${Primary}

// const theme = createMuiTheme({
//     palette: {
//       primary: {
//         main: '#4CAF50', // Custom primary color
//       },
//       secondary: {
//         main: '#FF4081', // Custom secondary color
//       },
//     },
//   });
//   <ThemeProvider theme={theme}> robi się to w app
// czcionka

//const theme = createMuiTheme({
// typography: {
//     fontFamily: 'Your Chosen Font, sans-serif',
//   },
// });

export const DivWrapper = styled.div`
    width: 380px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const LoginInput = styled.input`
    width: 356px;
    height: 34px;
    padding: 0px 12px;
    font-size: 18px;
    border-radius: 20px;
    border: none;

    &:focus {
        outline: nove;
        border: 1px;
    }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const LoginButtonContainer = styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
`;

export const LoginButton = styled.button`
    width: 200px;
    padding: 16px;
    border: 0;
    background-color: ${BLACK};
    border-radius: 28px;
    color: ${ORANGE};
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;

    &:disabled {
        background-color: #9e9e9e;
        color: #212121;
    }

    &:hover {
        filter: brightness(85%);
    }
`;

export const ValidationError = styled.span`
    color: ${BLACK};
    font-size: 13px;
`;

export const LoginLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const LoginLink = styled(Link)`
    text-decoration: none;
    color: ${BLACK};
    font-weight: 700;

    &:hover {
        // text-decoration: underline;
        cursor: pointer;
    }
`;

export const LoginLinkSpan = styled.span`
    color: ${WHITE};
    font-weight: 400;
`;

// export const SignInFormContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 8px;
// `;
