package com.garrison.leaderboard.dto;

public class LeaderboardEntry {

    private int rank;
    private Long fid;
    private String username;
    private Integer score;

    public LeaderboardEntry() {}

    public LeaderboardEntry(int rank, Long fid, String username, Integer score) {
        this.rank = rank;
        this.fid = fid;
        this.username = username;
        this.score = score;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public Long getFid() { return fid; }
    public void setFid(Long fid) { this.fid = fid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}