import React, { useState } from "react"; 
import "./TextGenerator.css"; // Import CSS for styling

function TextGenerator({ addToHistory, selectedHistoryItem }) {
    const [prompt, setPrompt] = useState("");
    const [generatedText, setGeneratedText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Handle Generate Button Click
    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setLoading(true);
        setGeneratedText(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/generate-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error("Error generating text");
            }

            const data = await response.json();
            const generatedResponse = {
                title: "Pollo AI",
                description: data.text,
                tags: ["Text Generation"],
                link: "#",
            };

            setGeneratedText(generatedResponse);
            addToHistory("text", { prompt, result: generatedResponse });

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
        // Handle Copy Button Click
    const handleCopy = () => {
        if (!generatedText?.description) return;
        
        navigator.clipboard.writeText(generatedText.description)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    // Update input & generated text when a history item is selected
    React.useEffect(() => {
        if (selectedHistoryItem) {
            setPrompt(selectedHistoryItem.prompt);
            setGeneratedText(selectedHistoryItem.result);
        }
    }, [selectedHistoryItem]);

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
                <h3>💡 Generated Text</h3>
                {generatedText && (
                    <div className="generated-content">
                        <div className="output-card">
                            <div className="output-header">
                                <h4>{generatedText.title}</h4>
                                <a href={generatedText.link} target="_blank" rel="noopener noreferrer">🔗</a>
                            </div>
                            <div className="tags">
                                {generatedText.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                            <p>{generatedText.description}</p>
                            <div className="buttons">
                                <a href={generatedText.link} className="try-now-btn" target="_blank">Try Now</a>
                                <button 
                                    className={`copy-btn ${copied ? 'copied' : ''}`} 
                                    onClick={handleCopy}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TextGenerator;