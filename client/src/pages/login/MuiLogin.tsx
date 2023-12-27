// import React, { useCallback, useContext, useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     FormControl,
//     FormHelperText,
//     IconButton,
//     InputAdornment,
//     InputLabel,
//     OutlinedInput,
//     Paper,
//     Stack,
//     TextField,
//     Typography,
// } from "@mui/material";
// import { LoginContainer, LoginIdeasIcon } from "./Login.styles";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import EmailIcon from "@mui/icons-material/Email";
// import LockIcon from "@mui/icons-material/Lock";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../context/UserContext";
// import { AuthApi } from "../../api/AuthApi";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
// import { toast } from "react-toastify";
// import jwtDecode from "jwt-decode";
// import { UserFromToken } from "../../models/UserFormToken";

// const textFieldStyles = {
//     // background: '#fb8c00'
// };

export default function MuiLogin() {
//     const navigate = useNavigate();
//     const { userModifier } = useContext(UserContext);
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [email, setEmail] = useState<string>("");
//     const [password, setPassword] = useState<string>("");
//     const [message, setMessage] = useState<string>("");

//     const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
//     const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

//     const onLoginClicked = useCallback(async () => {
//         try {
//             const result = await AuthApi.signIn({ email: email, password: password });

//             localStorage.setItem(ACCESS_TOKEN, result.data.access_token);
//             localStorage.setItem(REFRESH_TOKEN, result.data.access_token);

//             toast.success("You have successfully signed in", {
//                 position: toast.POSITION.TOP_RIGHT,
//                 autoClose: 2000,
//             });

//             const decodedAccessToken: UserFromToken = jwtDecode(result.data.access_token);

//             // userModifier({user_id: number, name: string, role: string, sub: string, exp: number;});
//             // userModifier({
//             //     user_id: decodedAccessToken.user_id,
//             //     name: decodedAccessToken.name,
//             //     role: decodedAccessToken.role,
//             //     sub: decodedAccessToken.sub,
//             //     exp: decodedAccessToken.exp
//             // });
//             userModifier({ ...decodedAccessToken });
//             setMessage("");

//             navigate("/");
//         } catch (error: any) {
//             let toastMessage: string;

//             if (error.response && error.response.status === 403) {
//                 toastMessage = "Incorrect email or password, try again";
//                 setMessage("Incorrect email or password, try again");
//             } else {
//                 toastMessage = "An error occured when trying to connect to server";
//                 setMessage("An error occured when trying to connect to server");
//             }
//             toast.error(toastMessage, {
//                 position: toast.POSITION.TOP_RIGHT,
//                 autoClose: 2000,
//             });
//         }
//     }, [email, password, navigate, userModifier]);

//     const handleClickShowPassword = () => setShowPassword((show) => !show);

//     const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.currentTarget.value);
//     };

//     const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setPassword(e.currentTarget.value);
//     };

//     useEffect(() => {
//         //RFC2822 Email Validation
//         const validRegex: RegExp =
//             /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//         const result: boolean = validRegex.test(email);
//         setIsEmailValid(result);
//     }, [email]);

//     useEffect(() => {
//         setIsPasswordValid(password.length > 0);
//     }, [password]);

//     useEffect(() => {
//         setMessage("");
//     }, [email, password]);

//     return (
//         <LoginContainer>
//             <Paper sx={{
//                     padding: '32px',
//                     display: 'flex',
//                     flexDirection: "column",
//                     alignItems: "center",
//                 }}
//                 elevation={4}
//             >
//                 <Box
//                     sx={{
//                         height: "50%",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         margin: "50px 0",
//                     }}
//                 >
//                     <LoginIdeasIcon />
//                     <Typography variant="h4" gutterBottom>
//                         Log in to Ideas App!
//                     </Typography>
//                 </Box>
//                 <Stack
//                     sx={{
//                         width: "400px",
//                     }}
//                     spacing={2}
//                 >
//                     <TextField
//                         label="E-mail"
//                         // style={{...textFieldStyles}}
//                         // sx={{ background: { lightGreen } }}
//                         required
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <EmailIcon />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         onChange={onEmailChange}
//                         helperText={email && isEmailValid ? "" : "Please provide your email"}
//                     />
//                     <TextField
//                         label="Password"
//                         required
//                         type={showPassword ? "text" : "password"}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <LockIcon />
//                                 </InputAdornment>
//                             ),
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton
//                                         aria-label="toggle password visibility"
//                                         onClick={handleClickShowPassword}
//                                         //   onMouseDown={handleMouseDownPassword}
//                                         edge="end"
//                                     >
//                                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             ),
//                         }}
//                         onChange={onPasswordChange}
//                         // error={!password}
//                         helperText={!password ? "Password required" : ""}
//                     />
//                 </Stack>

//                 <Button
//                     sx={{
//                         marginTop: "30px",
//                         marginBottom: "20px",
//                     }}
//                     variant="contained"
//                     color="info"
//                     disabled={isEmailValid && isPasswordValid ? false : true}
//                     onClick={onLoginClicked}
//                     size="medium"
//                 >
//                     Sign in
//                 </Button>
//                 <Typography variant="subtitle1" color="red">
//                     {message}
//                 </Typography>
//             </Paper>
//         </LoginContainer>
//     );
}
