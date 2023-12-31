package com.example.ideas.admission.model;

import com.example.ideas.thread.model.Thread;
import com.example.ideas.user.model.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@Table(name="admissions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long admissionId;

    @Column(name = "admission_text")
    private String content;

    @Column(name = "admission_date")
    private LocalDate dateOfPost;

    @OneToOne
    @JoinColumn(name = "admission_author")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "admission_id")
    @JsonIgnore
    @JsonBackReference
    private Thread thread;

    public Admission(String content) {
        this.content = content;
    }
}