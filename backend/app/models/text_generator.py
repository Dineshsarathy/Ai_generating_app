# from transformers import pipeline

# # Load GPT-based model from Hugging Face
# text_generator = pipeline("text-generation", model="gpt2")

# def generate_text(prompt):
#     generated_text = text_generator(prompt, max_length=50, num_return_sequences=1)
#     return generated_text[0]['generated_text']


# from transformers import pipeline

# # Use a better model than GPT-2
# text_generator = pipeline("text-generation", model="EleutherAI/gpt-neo-125M")

# def generate_text(prompt):
#     generated_text = text_generator(prompt, max_length=100, num_return_sequences=1)
#     return generated_text[0]['generated_text']


from transformers import pipeline


text_generator = pipeline("text-generation", model="gpt2")


def generate_text(prompt):
    formatted_prompt = f"Once upon a time, {prompt}"   
    generated_text = text_generator(
        formatted_prompt, 
        max_length=100,  
        num_return_sequences=1,
        temperature=0.8,  
        top_p=0.9,        
        do_sample=True,   
        pad_token_id=50256  
    )
    return generated_text[0]['generated_text'].replace(formatted_prompt, "").strip()  


