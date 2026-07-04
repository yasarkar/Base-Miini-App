package com.garrison.leaderboard.repository;

import com.garrison.leaderboard.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    @Query(value = """
        SELECT s.fid, MAX(s.username) as username, MAX(s.score) as best_score
        FROM scores s
        GROUP BY s.fid
        ORDER BY best_score DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopScores(@Param("limit") int limit);

    /**
     * Get all scores for a specific FID, ordered by score descending.
     */
    List<Score> findByFidOrderByScoreDesc(Long fid);
}