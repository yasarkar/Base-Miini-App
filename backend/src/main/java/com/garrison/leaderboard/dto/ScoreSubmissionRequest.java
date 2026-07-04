package com.garrison.leaderboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ScoreSubmissionRequest {

    @NotNull(message = "FID is required")
    private Long fid;

    private String username;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be non-negative")
    private Integer score;

    public ScoreSubmissionRequest() {}

    public ScoreSubmissionRequest(Long fid, String username, Integer score) {
        this.fid = fid;
        this.username = username;
        this.score = score;
    }

    public Long getFid() { return fid; }
    public void setFid(Long fid) { this.fid = fid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}