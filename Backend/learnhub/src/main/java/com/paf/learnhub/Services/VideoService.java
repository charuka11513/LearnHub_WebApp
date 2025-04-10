package com.paf.learnhub.Services;

import com.paf.learnhub.models.Video;
import com.paf.learnhub.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VideoService {
    @Autowired
    private VideoRepository videoRepository;

    public Video uploadVideo(Video video) {
        video.setUploadedAt(LocalDateTime.now());
        return videoRepository.save(video);
    }

    public List<Video> getVideosByPostId(String postId) {
        return videoRepository.findByPostId(postId);
    }
}