package com.example.ideas.user.service;

import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.helpers.ObjectProvider;
import com.example.ideas.security.auth.AuthenticationService;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.user.controller.UserResponseDTO;
import com.example.ideas.user.model.User;
import com.example.ideas.user.repository.UserRepository;
import com.example.ideas.util_Entities.department.model.Department;
import com.example.ideas.util_Entities.department.repository.DepartmentRepository;
import com.example.ideas.util_Entities.role.model.Role;
import com.example.ideas.util_Entities.role.repository.RoleRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;
    UserService underTest;
    @Autowired
    UserDTOMapper userDTOMapper;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        underTest = new UserService(
                userRepository,
                roleRepository,
                departmentRepository,
                authenticationService,
                userDTOMapper,
                jwtService
                );
    }

    @Test
    void getUsers() {
        //given
        //when
        List<UserResponseDTO> actual = underTest.getUsers();
        //then
        Assertions.assertThat(actual).isEmpty();
    }

    @Test
    void givenThatUserExistsItShouldFindUserById() throws EntityNotFoundException {
        //given
        User user = User.builder()
                .userId(1L)
                .name("User")
                .role(new Role(1L, "Admin"))
                .department(new Department(1L, "R&D"))
                .password("password")
                .email("user@test.pl")
                .build();

        UserResponseDTO expected = new UserResponseDTO(
                1L,
                "User",
                "user@test.pl",
                List.of("ROLE_Admin"),
                new Department(1L, "R&D")
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        //when
        UserResponseDTO actual = underTest.getUserById(1L);

        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @Test
    void givenThatTheUserWithGivenIdDoesNotExistItShouldThrowEntityNotFoundException() {
        //given
        long id = 100;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        //when
        //then
        assertThatThrownBy(() -> underTest.getUserById(id))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Object: " + id + " does not exist in database");

    }

    @Test
    void givenThatUserExistsItShouldFindUserByEmail() throws EntityNotFoundException {
        //given
        User user = User.builder()
                .userId(1L)
                .name("User")
                .role(new Role(1L, "Admin"))
                .department(new Department(1L, "R&D"))
                .password("password")
                .email("user@test.pl")
                .build();

        UserResponseDTO expected = new UserResponseDTO(
                1L,
                "User",
                "user@test.pl",
                List.of("ROLE_Admin"),
                new Department(1L, "R&D")
        );

        when(userRepository.findUserByEmail("user@test.pl")).thenReturn(Optional.of(user));

        //when
        UserResponseDTO actual = underTest.getUserByEmail("user@test.pl");

        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @Test
    void givenThatTheUserWithGivenEmailDoesNotExistItShouldThrowEntityNotFoundException() {
        //given
        when(userRepository.findUserByEmail("test@test.pl")).thenReturn(Optional.empty());

        //when
        //then
        assertThatThrownBy(() -> underTest.getUserByEmail("test@test.pl"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("user not found in DB");

    }

    @Test
    void givenThatUserExistsItShouldDeleteUser() {
        //given
        long id = 1;
        given(userRepository.existsById(id)).willReturn(true);

        //when
        underTest.deleteUser(id);

        //then
        verify(userRepository).deleteById(id);
    }

    @Test
    void givenThatUserDoesNotExistItShouldIllegalStateException() {
        //given
        long id = 1;
        given(userRepository.existsById(id)).willReturn(false);

        //when
        //then
        assertThatThrownBy(() -> underTest.deleteUser(id))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("student with id: " + id + " does not exists");
    }

    @Test
    @Disabled
    void updateUserById() {
    }

//    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2LCJyb2xlIjoiQWRtaW4iLCJuYW1lIjoiYWRtaW4iLCJzdWIiOiJhZG1pbkBhZG1pbi5wbCIsImlhdCI6MTY5OTQ3NjgxMywiZXhwIjoxNjk5NTYzMjEzfQ.Wxvm45cdWQP_pQWc6NvPMumuR1aSjRrFU0vBPF5Q6xU"
}