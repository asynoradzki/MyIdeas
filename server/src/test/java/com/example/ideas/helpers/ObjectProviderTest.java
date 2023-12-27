package com.example.ideas.helpers;

import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.user.model.User;
import com.example.ideas.user.repository.UserRepository;
import com.example.ideas.user.service.UserService;
import com.example.ideas.util_Entities.department.model.Department;
import com.example.ideas.util_Entities.role.model.Role;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ObjectProviderTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void shouldReturnUser() throws EntityNotFoundException {
        //given
        User user = User.builder()
                .userId(1L)
                .name("User")
                .role(new Role(1L, "Admin"))
                .department(new Department(1L, "R&D"))
                .password("password")
                .email("user@test.pl")
                .build();

        BDDMockito.when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(user));

        //when
        User actual = ObjectProvider.getObjectFromDB(1L, userRepository);

        //then
        Assertions.assertThat(actual).isEqualTo(user);
    }

    @Test
    void shouldThrowEntityNotFoundException() throws EntityNotFoundException {
        //given
        long id = 1;
        BDDMockito.when(userRepository.findById(id)).thenReturn(Optional.empty());

        //when
        //then
        assertThatThrownBy(() -> ObjectProvider.getObjectFromDB(id, userRepository))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Object: " + id + " does not exist in database");
    }

}