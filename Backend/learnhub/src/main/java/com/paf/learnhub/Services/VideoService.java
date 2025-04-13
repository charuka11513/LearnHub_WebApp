package com.paf.learnhub.Services;

import com.paf.learnhub.models.Video;
import com.paf.learnhub.repositories.VideoRepository;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    public Video uploadVideo(String postId, String userId, String userName, String title, String description, Binary videoData, Binary thumbnailData) {
        Video video = new Video();
        video.setId(UUID.randomUUID().toString());
        video.setPostId(postId);
        video.setUserId(userId);
        video.setUserName(userName);
        video.setTitle(title);
        video.setDescription(description);
        video.setVideoData(videoData);
        video.setThumbnailData(thumbnailData);
        video.setCreatedAt(LocalDateTime.now().toString());
        return videoRepository.save(video);
    }

    public Video updateVideo(String id, String userId, String title, String description, Binary videoData, Binary thumbnailData) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        if (!video.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        video.setTitle(title);
        video.setDescription(description);
        if (videoData != null) {
            video.setVideoData(videoData);
        }
        if (thumbnailData != null) {
            video.setThumbnailData(thumbnailData);
        }
        return videoRepository.save(video);
    }

    public void deleteVideo(String id, String userId) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        if (!video.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        videoRepository.deleteById(id);
    }

    public Video getVideoById(String id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    public List<Video> getVideosByPostId(String postId) {
        return videoRepository.findByPostId(postId);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }
}