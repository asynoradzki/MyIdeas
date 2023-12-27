package com.example.ideas.util_Entities.vote.controller;

import com.example.ideas.exception.EntityNotFoundException;
import com.example.ideas.util_Entities.vote.service.VoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/votes")
@RestController
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/addVote")
    public ResponseEntity<VoteResponseDTO> addVote(
            @RequestBody VoteRequest voteRequest
    ) throws EntityNotFoundException {
        return voteService.addVote(voteRequest.getThreadId(), voteRequest.getUserId(), voteRequest.getVoteType());
    }

    @DeleteMapping("/{vote_id}")
    public ResponseEntity<String> deleteVote(
            @RequestHeader("Authorization") String token,
            @PathVariable ("vote_id") Long voteId
    ) throws EntityNotFoundException {
        return voteService.deleteVote(voteId, token);
    }
}
