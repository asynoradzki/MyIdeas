package com.example.ideas.user.repository;

import com.example.ideas.user.model.User;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Optional;


@DataJpaTest
class UserRepositoryTest {

    @Autowired
    UserRepository underTest;

    @Test
    void itShouldFindUserByEmailAdmin(){
        // given
        String expected = "admin@admin.pl";
        // when
        Optional<User> actual = underTest.findUserByEmail("admin@admin.pl");
        // then
        Assertions.assertThat(actual.get().getEmail()).isEqualTo(expected);
    }

    @Test
    void itShouldNotFindUserByEmailTest(){
        // given
        // when
        Optional<User> actual = underTest.findUserByEmail("test@test.pl");
        // then
        Assertions.assertThat(actual.isPresent()).isEqualTo(false);
    }

}