import torch
import cv2
import numpy as np
import os
from diffusers import StableDiffusionPipeline
from PIL import Image

class VideoGenerator:
    def __init__(self):
        # Load a lightweight text-to-image model that works on CPUs
        self.pipe = StableDiffusionPipeline.from_pretrained(
            "stabilityai/sd-turbo",  # Optimized for low-memory usage
            torch_dtype=torch.float32
        ).to("cpu")

    def generate_frames(self, prompt, num_frames=10):
        """
        Generate images (frames) using text prompts.
        """
        frames = []
        for _ in range(num_frames):
            image = self.pipe(prompt).images[0]
            frames.append(image)
        return frames

    def save_frames(self, frames, output_dir="frames"):
        """
        Save generated images as frames.
        """
        os.makedirs(output_dir, exist_ok=True)
        frame_paths = []
        for i, frame in enumerate(frames):
            frame_path = os.path.join(output_dir, f"frame_{i}.png")
            frame.save(frame_path)
            frame_paths.append(frame_path)
        return frame_paths

    def create_video(self, frame_paths, output_file="static/output_video.mp4", fps=5):
        """
        Convert saved images into a video using OpenCV.
        """
        frame = cv2.imread(frame_paths[0])
        height, width, layers = frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for MP4 format

        video = cv2.VideoWriter(output_file, fourcc, fps, (width, height))

        for frame_path in frame_paths:
            image = cv2.imread(frame_path)
            video.write(image)

        video.release()
        return output_file

    def generate_video(self, prompt, num_frames=10, fps=5):
        """
        Complete pipeline: Generate video from text prompt.
        """
        frames = self.generate_frames(prompt, num_frames)
        frame_paths = self.save_frames(frames)
        video_path = self.create_video(frame_paths, fps=fps)
        return video_path
