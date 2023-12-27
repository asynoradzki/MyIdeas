package com.example.ideas.util_Entities.role.service;

import com.example.ideas.util_Entities.role.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService underTest;

    @Test
    void canGetAllRoles() {
        //given
        // when
        underTest.getRoles();
        // then
        verify(roleRepository).findAll(Sort.by(Sort.Direction.ASC, "roleId"));

    }

    @Test
    void canGetRoleById() {
        //given
        // when
        underTest.getRoleById(1L);
        //then
        verify(roleRepository).findById(1L);
    }

    @Test
    void canGetRoleByName() {
        //given
        // when
        underTest.getRoleByName("Admin");
        //then
        verify(roleRepository).findRoleByRoleName("Admin");
    }
}