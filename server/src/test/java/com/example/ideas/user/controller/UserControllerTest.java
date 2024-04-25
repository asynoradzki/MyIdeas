package com.example.ideas.user.controller;

import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.security.token.TokenRepository;
import com.example.ideas.user.model.User;
import com.example.ideas.user.service.UserService;
import com.example.ideas.util_Entities.department.model.Department;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

        List<UserResponseDTO> userResponseDTOS = objectMapper.readValue(contentAsString, new TypeReference<List<UserResponseDTO>>() {
        });
        // then
        assertTrue(userResponseDTOS.isEmpty());
    }

    @Test
    @WithMockUser(username = "employee@employee.pl", roles = {"Employee"})
    void givenSearchTermEqualsAAAAitShouldProvideAnEmptyUsersList() throws Exception {

        // given
        String searchTerm = "aaaa";
        when(userService.searchUsersByEmail(searchTerm)).thenReturn(new ArrayList<>());

        // when
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .param("searchTerm", searchTerm)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();

        List<UserResponseDTO> userResponseDTOS = objectMapper.readValue(contentAsString, new TypeReference<List<UserResponseDTO>>() {
        });

        // then
        assertTrue(userResponseDTOS.isEmpty());
    }

    @Test
    @WithMockUser(username = "employee@employee.pl", roles = {"Employee"})
    void itShouldFindAUserWithId1AndReturnStatusOk() throws Exception {
        // given
        Long userId = 1L;

        UserResponseDTO expected = new UserResponseDTO(
                1L,
                "User",
                "user@test.pl",
                List.of("ROLE_Admin"),
                new Department(1L, "R&D")
        );

        when(userService.getUserById(userId)).thenReturn(expected);

        // when
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/id/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper();
        UserResponseDTO actual = objectMapper.readValue(contentAsString, new TypeReference<UserResponseDTO>() {
        });

        // then
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    @WithMockUser(username = "employee@employee.pl", roles = {"Employee"})
    void itShouldNotFindAUserWithId10AndThrowEntityNotFoundException() throws Exception {
        // given
        Long userId = 10L;

        when(userService.getUserById(userId)).thenThrow(new EntityNotFoundException("Object: " + userId + " does not exist in database"));

        // when
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/id/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                )
                // then
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof EntityNotFoundException))
                .andExpect(result -> assertEquals(
                                "Object: " + userId + " does not exist in database",
                                Objects.requireNonNull(result.getResolvedException()).getMessage()
                        )
                );
    }

}