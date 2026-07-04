package com.garrison.leaderboard.controller;

import com.garrison.leaderboard.dto.LeaderboardEntry;
import com.garrison.leaderboard.dto.ScoreSubmissionRequest;
import com.garrison.leaderboard.model.Score;
import com.garrison.leaderboard.service.ScoreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public ResponseEntity<Score> submitScore(@Valid @RequestBody ScoreSubmissionRequest request) {
        Score saved = scoreService.submitScore(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        List<LeaderboardEntry> leaderboard = scoreService.getLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }
}