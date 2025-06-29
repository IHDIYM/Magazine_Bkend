# Tata Motors Magazine Backend API

A Flask-based backend API for the Tata Motors Magazine frontend, providing intelligent responses about Tata Motors vehicles using Google Gemini AI.

## 🚀 Features

- **AI-Powered Chatbot**: Uses Google Gemini 1.5 Flash for intelligent responses
- **CORS Enabled**: Configured for cross-origin requests from Netlify frontend
- **Enhanced Context**: Rich Tata Motors vehicle information database
- **Health Monitoring**: Built-in health check endpoints
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Python 3.8+
- Google Gemini API Key
- Required Python packages (see requirements.txt)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Magazine_Bkend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file:
   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   PORT=5005
   ```

## 🚀 Running the Application

### Development Mode
```bash
python query_data.py
```

### Production Mode
```bash
export PORT=5005
python query_data.py
```

The server will start on `http://localhost:5005`

## 📡 API Endpoints

### 1. Query Endpoint
- **URL**: `/api/query`
- **Method**: `POST`
- **Description**: Main endpoint for chatbot queries
- **Request Body**:
  ```json
  {
    "prompt": "Tell me about Tata Safari"
  }
  ```
- **Response**:
  ```json
  {
    "response": "The Tata Safari is a premium 7-seater SUV..."
  }
  ```

### 2. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Description**: Health monitoring endpoint
- **Response**:
  ```json
  {
    "status": "healthy",
    "message": "Tata Motors API is running"
  }
  ```

### 3. Root Endpoint
- **URL**: `/`
- **Method**: `GET`
- **Description**: API information
- **Response**:
  ```json
  {
    "message": "Tata Motors Magazine API",
    "version": "1.0.0",
    "endpoints": {
      "query": "/api/query",
      "health": "/health"
    }
  }
  ```

## 🔧 Configuration

### CORS Settings
The API is configured to accept requests from:
- `https://tatamotorsmagazine.netlify.app`
- `https://frabjous-cupcake-7d90f7.netlify.app`
- `http://localhost:5173` (development)
- `http://localhost:3000` (alternative development)

### Environment Variables
- `GOOGLE_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default: 5005)

## 📊 Vehicle Information Database

The backend includes comprehensive information about Tata Motors vehicles:

### SUVs
- **Safari**: 7-seater premium SUV
- **Harrier**: Premium SUV
- **Nexon**: Subcompact SUV
- **Punch**: Micro SUV

### Electric Vehicles
- **Nexon EV**: Best-selling electric SUV
- **Tiago EV**: Electric hatchback
- **Tigor EV**: Electric sedan

### Other Categories
- **Hatchbacks**: Tiago, Altroz
- **Sedans**: Tigor

## 🔒 Security

- API keys are stored in environment variables
- CORS is configured for specific origins only
- Input validation and error handling implemented

## 🚀 Deployment

### Using ngrok (for development)
```bash
# Start the Flask app
python query_data.py

# In another terminal, start ngrok
ngrok http 5005
```

### Production Deployment
For production deployment, consider:
- Using a proper hosting service (Heroku, Railway, etc.)
- Setting up proper SSL certificates
- Implementing rate limiting
- Adding authentication if needed

## 📝 Logging

The application includes comprehensive logging:
- Request/response logging
- Error logging with stack traces
- API key usage monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This backend is designed to work with the Tata Motors Magazine frontend deployed on Netlify. 