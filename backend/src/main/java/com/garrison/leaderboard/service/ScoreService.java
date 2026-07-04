package com.garrison.leaderboard.service;

import com.garrison.leaderboard.dto.LeaderboardEntry;
import com.garrison.leaderboard.dto.ScoreSubmissionRequest;
import com.garrison.leaderboard.model.Score;
import com.garrison.leaderboard.repository.ScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    @Transactional
    public Score submitScore(ScoreSubmissionRequest request) {
        Score score = new Score(
            request.getFid(),
            request.getUsername() != null ? request.getUsername() : "FID:" + request.getFid(),
            request.getScore()
        );
        return scoreRepository.save(score);
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntry> getLeaderboard(int limit) {
        int effectiveLimit = Math.min(Math.max(limit, 1), 100);
        List<Object[]> results = scoreRepository.findTopScores(effectiveLimit);
        List<LeaderboardEntry> entries = new ArrayList<>();

        int rank = 1;
        for (Object[] row : results) {
            Long fid = ((Number) row[0]).longValue();
            String username = (String) row[1];
            Integer bestScore = ((Number) row[2]).intValue();

            entries.add(new LeaderboardEntry(rank, fid, username, bestScore));
            rank++;
        }

        return entries;
    }
}