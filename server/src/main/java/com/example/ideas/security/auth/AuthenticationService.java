package com.example.ideas.security.auth;


import com.example.ideas.exception.DataAlreadyExistsException;
import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.security.token.*;
import com.example.ideas.thread.utils.EmailSender;
import com.example.ideas.user.model.User;
import com.example.ideas.user.repository.UserRepository;
import com.example.ideas.util_Entities.department.repository.DepartmentRepository;
import com.example.ideas.util_Entities.role.repository.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import static com.example.ideas.helpers.ObjectProvider.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSender emailSender;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;


    public AuthenticationResponse register(RegisterRequest request, String token)
            throws EntityNotFoundException, DataAlreadyExistsException {

        String userRoleName = getUserRoleName(token);

        Optional<User> optionalUser = repository.findUserByEmail(request.getEmail());
        if (optionalUser.isPresent()) {
            throw new DataAlreadyExistsException("email already exists in DB");
        }

        User user = mapRegisterRequestToUser(request, userRoleName);

        User savedUser = repository.save(user);
        String jwtToken = getJwtToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private User mapRegisterRequestToUser(RegisterRequest request, String userRoleName) throws EntityNotFoundException {
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role((request.getRoleId() != null && request.getRoleId() != 0 /*&& Objects.equals(userRoleName, "Admin")*/) ?
                        getObjectFromDB(request.getRoleId(), roleRepository) :
                        roleRepository.findRoleByRoleName("Employee").orElseThrow(() ->
                                new EntityNotFoundException("Role Employee does not exist in DB"))
                )
                .department(getObjectFromDB(request.getDepartmentId(), departmentRepository))
                .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = repository.findUserByEmail(request.getEmail())
                .orElseThrow();
        String jwtToken = getJwtToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getUserId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            User user = this.repository.findUserByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = getJwtToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                AuthenticationResponse authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public ResponseEntity<AuthenticationResponse> changePassword(PasswordChangeRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // todo napisać password validator user i użyć go tutaj
        if (request.getNewPassword().isEmpty() || request.getNewPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    AuthenticationResponse.builder().build()
            );
        }

        User user = repository.findUserByEmail(request.getEmail())
                .orElseThrow();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        repository.save(user);
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .build()
                );
    }

    public ResponseEntity<String> resetPassword(String userEmail, String baseURL) {

        Optional<User> userOptional = repository.findUserByEmail(userEmail);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        String token = UUID.randomUUID().toString();
        User user = userOptional.get();

        PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(new Date(System.currentTimeMillis() + 600000)) // 10 minut ważny
                .build();

        passwordResetTokenRepository.save(passwordResetToken);

        String from = "emailsender666666@gmail.com";
        String recipientEmail = "emailsender666666@gmail.com";
        String subject = "Password reset";
        String text = baseURL + "/" + token;
        emailSender.sendEmail(from, recipientEmail, subject, text);

        return ResponseEntity.ok("password reset email sent");
    }

    public ResponseEntity<String> changePassword(String token, String newPassword) {

        Optional<PasswordResetToken> passwordResetTokenOptional = passwordResetTokenRepository.findPasswordResetTokenByToken(token);

        if (passwordResetTokenOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // todo napisać password validator user i użyć go tutaj
        PasswordResetToken passwordResetToken = passwordResetTokenOptional.get();

        if (passwordResetToken.getExpiryDate().before(new Date(System.currentTimeMillis()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token expired");
        }

        User user = passwordResetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);

        return ResponseEntity.ok("User password successfully updated");
    }

    private String getJwtToken(User user) {
        return jwtService.generateToken(
                Map.of("role", user.getRole().getRoleName(), "name", user.getName(), "user_id", user.getUserId()),
                user
        );
    }

    public String getUserRoleName(String token) {
        String userRoleName = null;
        if (token != null && !token.isEmpty()) {
            String userJWTToken = jwtService.getJWT(token);
            userRoleName = jwtService.extractUserRole(userJWTToken);
        }
        return userRoleName;
    }

}
