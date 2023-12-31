package com.example.ideas.security.auth;

import com.example.ideas.exception.DataAlreadyExistsException;
import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody RegisterRequest request
    ) throws EntityNotFoundException, DataAlreadyExistsException {
        return new ResponseEntity<>(authenticationService.register(request, token), HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthenticationResponse> changePassword(
            @RequestBody PasswordChangeRequest request
    ) {
        return authenticationService.changePassword(request);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            HttpServletRequest request,
            @RequestParam("email") String userEmail
    ) {
        String baseUrl = "http://localhost:3000/reset-password";
        return authenticationService.resetPassword(userEmail, baseUrl);
    }

    @PatchMapping("reset-password/{token}")
    public ResponseEntity<String> changePassword(
            @PathVariable("token") String token,
            @RequestBody NewPasswordRequest newPasswordRequest
    ) {
        return authenticationService.changePassword(token, newPasswordRequest.password());
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authenticationService.refreshToken(request, response);
    }

}
