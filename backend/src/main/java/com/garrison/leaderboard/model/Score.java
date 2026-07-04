package com.garrison.leaderboard.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "scores", indexes = {
    @Index(name = "idx_score_value", columnList = "score DESC"),
    @Index(name = "idx_fid_score", columnList = "fid, score DESC")
})
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long fid;

    @Column(length = 100)
    private String username;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Score() {}

    public Score(Long fid, String username, Integer score) {
        this.fid = fid;
        this.username = username;
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFid() { return fid; }
    public void setFid(Long fid) { this.fid = fid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}