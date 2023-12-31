package com.example.ideas.thread.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ThreadCreateDTO {
    @NotBlank(message = "title shouldn't be null")
    private String title;
    @NotBlank(message = "description shouldn't be null")
    private String description;
    @NotBlank(message = "justification shouldn't be null")
    private String justification;
    @NotBlank(message = "E-mail shouldn't be null")
    @Email(message = "invalid email address")
    private String userEmail;

    private Long categoryId;
}
