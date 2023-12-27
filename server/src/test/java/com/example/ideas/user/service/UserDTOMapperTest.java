package com.example.ideas.user.service;

import com.example.ideas.user.controller.UserResponseDTO;
import com.example.ideas.user.model.User;
import com.example.ideas.util_Entities.department.model.Department;
import com.example.ideas.util_Entities.role.model.Role;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserDTOMapperTest {

    @Autowired
    private UserDTOMapper underTest;

    @Test
    void shouldMapUserToUserResponseDTO() {
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
        //when
        UserResponseDTO actual = underTest.apply(user);
        //then
        Assertions.assertThat(actual).isEqualTo(expected);
    }
}