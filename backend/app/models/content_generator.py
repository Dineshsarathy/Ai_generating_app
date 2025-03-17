from transformers import pipeline

# Load a lightweight AI model (GPT-Neo)
generator = pipeline("text-generation", model="gpt2")

def generate_content(prompt: str):
    response = generator(
        prompt,
        max_length=350,  # Length of output text
        num_return_sequences=1,
        temperature=0.9,
        top_p=0.95,
        do_sample=True,
    )
    return response[0]['generated_text']