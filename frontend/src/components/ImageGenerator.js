import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import "./ImageGenerator.css"; 

function ImageGenerator({ addToHistory }) {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("⚠ Please enter a prompt.");
            return;
        }

        setLoading(true);
        setImageUrl("");
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const data = await response.json();
            if (data.image_url) {
                const generatedImageUrl = `${data.image_url}?timestamp=${new Date().getTime()}`;
                setImageUrl(generatedImageUrl);
                
                addToHistory({ prompt, result: generatedImageUrl });
            } else {
                setError("❌ Image generation failed. Try again.");
            }
        } catch (error) {
            setError(`❌ ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!imageUrl) return;
    
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob(); // Convert image to Blob
    
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "generated-image.png"; // Set filename
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Cleanup Blob URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };
    

    return (
        <div className="image-generator-container">
            <div className="input-box">
                <h3><LuImagePlus className="icon" /> Image Prompt</h3>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter prompt for image..."
                />
                <button onClick={handleGenerate} disabled={loading} className="generate-btn">
                    {loading ? "Generating..." : "Generate Image"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>

            {imageUrl && (
                <div className="output-box">
                    <h3>🎨 Generated Image</h3>
                    <div className="image-card">
                        <img src={imageUrl} alt="Generated" className="generated-img"/>
                        <div className="buttons">
                            <button className="download-btn" onClick={handleDownload}>
                                <FaDownload /> Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageGenerator;
