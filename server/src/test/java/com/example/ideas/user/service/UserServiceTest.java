package com.example.ideas.user.service;

import com.example.ideas.exception.DataAlreadyExistsException;
import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.exception.NoAuthorizationException;
import com.example.ideas.helpers.ObjectProvider;
import com.example.ideas.security.auth.AuthenticationService;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.user.controller.UserResponseDTO;
import com.example.ideas.user.controller.UserUpdateRequest;
import com.example.ideas.user.model.User;
import com.example.ideas.user.repository.UserRepository;
import com.example.ideas.util_Entities.department.model.Department;
import com.example.ideas.util_Entities.department.repository.DepartmentRepository;
import com.example.ideas.util_Entities.role.model.Role;
import com.example.ideas.util_Entities.role.repository.RoleRepository;
import jakarta.validation.constraints.Email;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
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
    @Mock
    private AuthenticationService authenticationService;
    @Mock
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
    @Disabled
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
    void givenTheUserIsNotAdminAndWantsToUpdateAnotherUserProfileShouldThrowNoAuthorizationException1() {
        //given
        User user = User.builder()
                .userId(2L)
                .name("User")
                .role(new Role(4L, "Employee"))
                .department(new Department(1L, "R&D"))
                .password("password")
                .email("user@test.pl")
                .build();

        Long userId = 2L;
        UserUpdateRequest userUpdateRequest =
                new UserUpdateRequest("Alex_updated", null, null, null);
        String token = "Bearer token";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(authenticationService.getUserRoleName(token)).thenReturn("Employee");
        when(jwtService.getJWT(token)).thenReturn("token");
        when(jwtService.extractUsername("token")).thenReturn("employee@employee.pl");
        //when
        //then
        assertThatThrownBy(() -> underTest.updateUserById(userId, userUpdateRequest, token))
                .isInstanceOf(NoAuthorizationException.class)
                .hasMessageContaining("user details can only be modified by the data owner or Admin");
    }

    @ParameterizedTest
    @CsvSource({"Employee, employee@employee.pl", "Admin,admin@admin.pl"})
    void givenTheUserIsAdminOrWantsToUpdateOwnProfileNameShouldBeSuccessful1(String role, String email) throws DataAlreadyExistsException, NoAuthorizationException, EntityNotFoundException, IllegalAccessException {
        //given
        User user = User.builder()
                .userId(7L)
                .name("Employee")
                .role(new Role(4L, "Employee"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("employee@employee.pl")
                .build();

        UserResponseDTO expected = new UserResponseDTO(
                7L,
                "Employee_updated",
                "employee@employee.pl",
                List.of("ROLE_Employee"),
                new Department(2L, "Human Resources Division")
        );

        Long userId = 7L;
        UserUpdateRequest userUpdateRequest =
                new UserUpdateRequest("Employee_updated", null, null, null);

        String token = "Bearer token";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        when(authenticationService.getUserRoleName(token)).thenReturn(role);
        when(jwtService.getJWT(token)).thenReturn("token");
        when(jwtService.extractUsername("token")).thenReturn(email);
        //when
        UserResponseDTO actual = underTest.updateUserById(7L, userUpdateRequest, token);
        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource({"Employee, employee@employee.pl", "Admin,admin@admin.pl"})
    void givenTheUserHasRightsToUpdateButWantsToChangeEmailToOneThatAlreadyExistsShouldThrowDataAlreadyExistsException(String role, String email) {
        //given
        User user = User.builder()
                .userId(7L)
                .name("employee")
                .role(new Role(4L, "Employee"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("employee@employee.pl")
                .build();

        Long userId = 2L;
        UserUpdateRequest userUpdateRequest =
                new UserUpdateRequest(null, "employee@employee.pl", null, null);
        String token = "Bearer token";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        when(userRepository.findUserByEmail("employee@employee.pl")).thenReturn(Optional.of(user));
        when(authenticationService.getUserRoleName(token)).thenReturn(role);
        when(jwtService.getJWT(token)).thenReturn("token");
        when(jwtService.extractUsername("token")).thenReturn(email);
        //when
        //then
        assertThatThrownBy(() -> underTest.updateUserById(userId, userUpdateRequest, token))
                .isInstanceOf(DataAlreadyExistsException.class)
                .hasMessageContaining("email already exists in DB");
    }

    @ParameterizedTest
    @CsvSource({"Employee, employee@employee.pl"})
    void givenTheUserHasNoRightsToChangeRoleShouldThrowIllegalAccessExceptionException(String role, String email) {
        //given
        User user = User.builder()
                .userId(7L)
                .name("employee")
                .role(new Role(4L, "Employee"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("employee@employee.pl")
                .build();

        Long userId = 2L;
        UserUpdateRequest userUpdateRequest =
                new UserUpdateRequest(null, null, 1L, null);
        String token = "Bearer token";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        when(authenticationService.getUserRoleName(token)).thenReturn(role);
        when(jwtService.getJWT(token)).thenReturn("token");
        when(jwtService.extractUsername("token")).thenReturn(email);
        //when
        //then
        assertThatThrownBy(() -> underTest.updateUserById(userId, userUpdateRequest, token))
                .isInstanceOf(IllegalAccessException.class)
                .hasMessageContaining("This user has no authority to modify role");
    }

    @ParameterizedTest
    @CsvSource({"Admin,admin@admin.pl"})
    void givenTheUserIsAdminShouldBeAbleToUpdateAllData(String role, String email) throws DataAlreadyExistsException, NoAuthorizationException, EntityNotFoundException, IllegalAccessException {
        //given
        User user = User.builder()
                .userId(7L)
                .name("Employee")
                .role(new Role(4L, "Employee"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("employee@employee.pl")
                .build();

        UserResponseDTO expected = new UserResponseDTO(
                7L,
                "Employee_updated",
                "employee_updated@employee.pl",
                List.of("ROLE_Admin"),
                new Department(1L, "Department of Strategic Planning")
        );

        Long userId = 7L;
        UserUpdateRequest userUpdateRequest =
                new UserUpdateRequest("Employee_updated", "employee_updated@employee.pl", 1L, 1L);

        String token = "Bearer token";

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.findUserByEmail("employee_updated@employee.pl")).thenReturn(Optional.empty());
        when(roleRepository.findById(1L)).thenReturn(Optional.of(new Role(1L, "Admin")));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(new Department(1L , "Department of Strategic Planning")));
        when(authenticationService.getUserRoleName(token)).thenReturn(role);
        when(jwtService.getJWT(token)).thenReturn("token");
        when(jwtService.extractUsername("token")).thenReturn(email);

        //when
        UserResponseDTO actual = underTest.updateUserById(7L, userUpdateRequest, token);
        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource(value={"tes", "null" },  nullValues={"null"})
    void givenTheSearchTermIsLessThan4CharactersLongOrNullShouldReturnAnEmptyList(String searchTerm){
        //given
        List<UserResponseDTO> expected = new ArrayList<>();

        //when
        List<UserResponseDTO> actual = underTest.searchUsersByEmail(searchTerm);

        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @Test
    void givenSearchTermEqualsAAAAAndNoUserIsFoundShouldReturnEmptyList() {
        //given
        String searchTerm = "aaaa";
        List<UserResponseDTO> expected = new ArrayList<>();

        when(userRepository.findByEmailContainsIgnoreCase(searchTerm)).thenReturn(new ArrayList<>());

        //when
        List<UserResponseDTO> actual = underTest.searchUsersByEmail(searchTerm);

        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

    @Test
    void givenSearchTermEqualsEMPLOYEEAndTwoUsersHaveBeenFoundShouldReturnAListOf2() {
        //given

        User user1 = User.builder()
                .userId(7L)
                .name("Employee")
                .role(new Role(4L, "Employee"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("employee@employee.pl")
                .build();

        User user2 = User.builder()
                .userId(6L)
                .name("Admin")
                .role(new Role(1L, "Admin"))
                .department(new Department(2L, "Human Resources Division"))
                .password("$2a$10$vHWoqmsCt4jlQBMaEoBlquvCk9NVSuyxuUrvOvGDghOHWcLra55sS")
                .email("admin@employee.pl")
                .build();

        UserResponseDTO user1Response = new UserResponseDTO(
                7L,
                "Employee",
                "employee@employee.pl",
                List.of("ROLE_Employee"),
                new Department(2L, "Human Resources Division")
        );

        UserResponseDTO user2Response = new UserResponseDTO(
                6L,
                "Admin",
                "admin@employee.pl",
                List.of("ROLE_Admin"),
                new Department(2L, "Human Resources Division")
        );

        List<User> users = List.of(user1, user2);
        List<UserResponseDTO> expected = List.of(user1Response, user2Response);

        String searchTerm = "employee";

        when(userRepository.findByEmailContainsIgnoreCase(searchTerm)).thenReturn(users);

        //when
        List<UserResponseDTO> actual = underTest.searchUsersByEmail(searchTerm);

        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }

}