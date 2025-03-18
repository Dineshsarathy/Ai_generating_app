import React, { useState } from "react"; 
import axios from "axios";
import "./VideoGenerator.css"; 

function VideoGenerator({ addToHistory }) {
    const [prompt, setPrompt] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateVideo = async () => {
        setLoading(true);
        setVideoUrl("");
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:8000/generate-video",
                { prompt },
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "blob", // ✅ Ensures binary response
                }
            );

            const url = URL.createObjectURL(new Blob([response.data], { type: "video/mp4" }));
            setVideoUrl(url);
            addToHistory("video", { prompt, result: url });

        } catch (error) {
            console.error("Error generating video:", error);
            setError("Failed to generate video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadVideo = (e) => {
        e.preventDefault();
        if (!videoUrl) return;

        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = "generated_video.mp4"; // ✅ Sets filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="generator-container">
            {/* Left: Input Box */}
            <div className="input-box">
                <h3>✏ Input Text</h3>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your text here..."
                />
                <button onClick={generateVideo} disabled={loading} className="generate-btn">
                    {loading ? "Generating..." : "Generate"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Right: Generated Video Output */}
            {videoUrl && (
                <div className="output-box">
                    <h3>🎥 Generated Video</h3>
                    <div className="output-card">
                        <div className="output-header">
                            <strong>AI Generated</strong>
                        </div>
                        <video controls width="100%" src={videoUrl} className="video-preview" />
                        <div className="buttons">
                        <a href={videoUrl} download="generated_video.mp4" className="download-btn" onClick={downloadVideo}>
                                📥 Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoGenerator;

