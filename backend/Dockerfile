# Use official Python image as a base
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy the backend files to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose the port FastAPI runs on
EXPOSE 8000

# Set environment variables (if required)
ENV DATABASE_URL=postgresql://postgres:Dinesh%400402@postgres:5432/ai_db

# Command to run FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
