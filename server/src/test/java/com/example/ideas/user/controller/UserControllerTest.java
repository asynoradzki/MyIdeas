package com.example.ideas.user.controller;

import com.example.ideas.security.config.JwtAuthenticationFilter;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.security.token.Token;
import com.example.ideas.security.token.TokenRepository;
import com.example.ideas.security.token.TokenType;
import com.example.ideas.user.model.User;
import com.example.ideas.user.service.UserService;
import com.example.ideas.util_Entities.department.model.Department;
import com.example.ideas.util_Entities.role.model.Role;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
@WithMockUser(username = "employee@employee.pl", roles = {"Employee"})
class UserControllerTest {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private String generateJwtToken(User user) {
        assert jwtService != null;
        return jwtService.generateToken(
                Map.of("role", user.getRole().getRoleName(), "name", user.getName(), "user_id", user.getUserId()),
                user
        );
    }

    @Test
    @WithMockUser(username = "employee@employee.pl", roles = {"Employee"})
    void itShouldGetAnEmptyUsersList() throws Exception {
        // given
//        User user = new User(
//                7L,
//                "employee",
//                "employee@employee.pl",
//                "$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS",
//                new Role(4L, "Employee"),
//                new Department(2L, "Human Resources Division")
//        );

        when(userService.getUsers()).thenReturn(new ArrayList<>());

        // Generate a valid JWT token for testing
//        String jwtToken = generateJwtToken(user);
//        Token token = Token.builder()
//                .user(user)
//                .token(jwtToken)
//                .tokenType(TokenType.BEARER)
//                .expired(false)
//                .revoked(false)
//                .build();
//        tokenRepository.save(token); //zapisuje do bazy danych H2 token

        // when
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(
                                "/users/")
                        .contentType(MediaType.APPLICATION_JSON)
//                        .header("Authorization", "Bearer " + jwtToken)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();

        List<User> users = objectMapper.readValue(contentAsString, new TypeReference<List<User>>() {
        });
        // then
        Assertions.assertTrue(users.isEmpty());
    }
}