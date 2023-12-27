package com.example.ideas.util_Entities.role.repository;

import com.example.ideas.util_Entities.category.model.Category;
import com.example.ideas.util_Entities.role.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class RoleRepositoryTest {

    @Autowired
    RoleRepository underTest;

    @Test
    void itShouldFindRoleByRoleNameEqualsAdmin() {
        // given
        // when
        Role actual = underTest.findRoleByRoleName("Admin").get();

        // then
        assertEquals("Admin", actual.getRoleName());
    }

    @Test
    void itShouldNotFindRoleByRoleNameEqualsTest() {
        //given
        //when
        Optional<Role> RoleOptional = underTest.findRoleByRoleName("Test");
        boolean actual = RoleOptional.isPresent();

        assertThat(actual).isFalse();
    }

}