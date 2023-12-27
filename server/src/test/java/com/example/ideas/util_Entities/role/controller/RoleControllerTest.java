package com.example.ideas.util_Entities.role.controller;

import com.example.ideas.util_Entities.role.model.Role;
import com.example.ideas.util_Entities.role.service.RoleService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
class RoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoleService roleService;

    @Test
    void itShouldGetAnEmptyRoleList() throws Exception {

        //given
        when(roleService.getRoles()).thenReturn(new ArrayList<>());
        //when
        MvcResult mvcResult = mockMvc.perform(get("/roles/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String content = mvcResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();

        List<Role> roles = objectMapper.readValue(content, new TypeReference<List<Role>>() {
        });
        //then
        assertTrue(roles.isEmpty());
    }

    @Test
    void itShouldGetAllRoles() throws Exception {

        //given
        Role admin = new Role(1L, "Admin");
        Role user = new Role(2L, "User");

        when(roleService.getRoles()).thenReturn(List.of(admin, user));
        //when
        MvcResult mvcResult = mockMvc.perform(get("/roles/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String content = mvcResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();

        List<Role> roles = objectMapper.readValue(content, new TypeReference<List<Role>>() {
        });
        //then
        Assertions.assertThat(roles).isEqualTo(List.of(admin, user));
    }


    @Test
    void itShouldReturnRoleAdmin() throws Exception {
        //given
        Role admin = new Role(1L, "Admin");

        when(roleService.getRoleByName("Admin")).thenReturn(Optional.of(admin));
        //when
        MvcResult mvcResult = mockMvc.perform(get("/roles/name/Admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String content = mvcResult.getResponse().getContentAsString();

        ObjectMapper objectMapper = new ObjectMapper();

        Role role = objectMapper.readValue(content, new TypeReference<Role>() {});
        //then
        Assertions.assertThat(role).isEqualTo(admin);
    }


    @Test
    void itShouldReturnStatusNotFound() throws Exception {
        //given
        when(roleService.getRoleByName("NotExisting")).thenReturn(Optional.empty());
        //when
        //then
        mockMvc.perform(get("/roles/name/NotExisting")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Disabled
    void getRoleById() {
    }
}