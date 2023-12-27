package com.example.ideas.util_Entities.vote.service;

import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.security.config.JwtService;
import com.example.ideas.thread.model.Thread;
import com.example.ideas.util_Entities.vote.controller.VoteResponseDTO;
import com.example.ideas.util_Entities.vote.model.Vote;
import com.example.ideas.util_Entities.vote.model.VoteType;
import com.example.ideas.thread.repository.ThreadRepository;
import com.example.ideas.util_Entities.vote.repository.VoteRepository;
import com.example.ideas.user.model.User;
import com.example.ideas.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.example.ideas.helpers.ObjectProvider.getObjectFromDB;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;
    private final VoteDTOMapper voteDTOMapper;
    private final JwtService jwtService;

    public ResponseEntity<VoteResponseDTO> addVote(Long threadId, Long userId, VoteType voteType) throws EntityNotFoundException {

        List<Vote> allByThreadAndUser = voteRepository.findVotesByThreadAndUser(threadId, userId);

        if (!allByThreadAndUser.isEmpty()) {
            voteRepository.deleteAll(allByThreadAndUser);
        }

        Thread thread = getObjectFromDB(threadId, threadRepository);
        User user = getObjectFromDB(userId, userRepository);

        Vote vote = Vote.builder()
                .thread(thread)
                .user(user)
                .voteType(voteType)
                .build();

        return ResponseEntity.ok(voteDTOMapper.apply(voteRepository.save(vote)));
    }

    public ResponseEntity<String> deleteVote(Long voteId, String token) throws EntityNotFoundException {

        Long userId = getUserId(token);

        Vote vote = getObjectFromDB(voteId, voteRepository);

        if(!vote.getUser().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("a user can delete his own votes");
        }

        voteRepository.delete(vote);

        return ResponseEntity.ok("vote deleted");
    }

    public Long getUserId(String token) {
        String jwt = jwtService.getJWT(token);
        return jwtService.extractUserId(jwt);
    }
}
