package com.garrison.leaderboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoreSubmissionRequest {

    @NotNull(message = "FID is required")
    @Min(value = 1, message = "FID must be a positive number")
    private Long fid;

    @Size(max = 100, message = "Username must be under 100 characters")
    private String username;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be non-negative")
    private Integer score;
}