import React, { useState } from "react";
import "./ContentGenerator.css"; // Import CSS for styling

function ContentGenerator({ addToHistory, selectedHistoryItem }) {
    const [prompt, setPrompt] = useState("");
    const [generatedContent, setGeneratedContent] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pre-fill the input box when a history item is selected
    React.useEffect(() => {
        if (selectedHistoryItem) {
            setPrompt(selectedHistoryItem.prompt);
            setGeneratedContent(selectedHistoryItem.result);
        }
    }, [selectedHistoryItem]);

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedContent(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error("Error generating content");
            }

            const data = await response.json();
            const newGeneratedContent = {
                title: "AI Generated Content",
                description: data.content,
                tags: ["Content Generation", "AI Writing"],
                link: "#",
            };

            setGeneratedContent(newGeneratedContent);
            addToHistory("content", { prompt, result: newGeneratedContent });

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
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
                <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>

            {/* Right: Generated Output */}
            <div className="output-box">
                <h3>💡 Generated Content</h3>
                {generatedContent && (
                    <div className="generated-content">
                        <div className="output-card">
                            <div className="output-header">
                                <h4>{generatedContent.title}</h4>
                                <a href={generatedContent.link} target="_blank" rel="noopener noreferrer">🔗</a>
                            </div>
                            <div className="tags">
                                {generatedContent.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                            <p>{generatedContent.description}</p>
                            <div className="buttons">
                                <a href={generatedContent.link} className="try-now-btn" target="_blank">Try Now</a>
                                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(generatedContent.description)}>📋 Copy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContentGenerator;
