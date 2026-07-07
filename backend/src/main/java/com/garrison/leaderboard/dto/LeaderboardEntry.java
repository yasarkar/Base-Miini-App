package com.garrison.leaderboard.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private int rank;
    private Long fid;
    private String username;
    private Integer score;
}