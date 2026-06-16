# SmartAI - Robotic Crop Disease Detection Project

## Overview
SmartAI is an AI-powered platform for crop disease detection, farm simulation, and precision agricultural treatment. This project includes both a Django backend and a modern frontend with responsive design.

## Features
✅ **AI Disease Detection** - Analyze crop images to identify diseases early
✅ **Account Authentication** - Secure registration and login system
✅ **Farm Simulation** - Model autonomous monitoring routes and field zones
✅ **Precision Treatment** - Recommend targeted treatment actions
✅ **Agricultural Analytics** - Track trends across detections and treatment history
✅ **Interactive Chatbot** - 24/7 crop health assistant powered by Groq AI
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
✅ **Robot-Ready Interface** - Optimized for robotic interfaces and autonomous systems

## Tech Stack
- **Backend**: Django 6.0.6, Python 3.x
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Chatbot**: Groq API (LLaMA 3 8B)
- **Database**: SQLite (default)
- **Deployment**: Vercel

## Project Structure
```
.
├── Robotic/                    # Django project
│   ├── Roboapp/               # Main application
│   ├── settings.py            # Django settings
│   └── urls.py                # URL routing
├── frontend/                  # Frontend files
│   ├── pages/                 # HTML pages
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   └── assets/                # Images and resources
├── templates/                 # Django templates
├── manage.py                  # Django management
└── README.md                  # This file
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Node.js (optional, for frontend tools)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mwebidouglas08-netizen/ROBOTIC-CROP-DISEASE-DETECTION-PROJECT.git
   cd ROBOTIC-CROP-DISEASE-DETECTION-PROJECT
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

4. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   GROQ_API_KEY=your-groq-api-key
   ```

5. **Run migrations**
   ```bash
   cd Robotic
   python manage.py migrate
   ```

6. **Create superuser** (optional, for admin panel)
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```
   The application will be available at `http://localhost:8000`

## Usage

### Account Creation
1. Navigate to `/register/`
2. Fill in your username, email, and password
3. Click "Create account"
4. Log in with your credentials

### Dashboard
- Access the main dashboard at `/dashboard/`
- View crop health monitoring
- Access AI disease detection
- Check treatment history and analytics

### Chatbot
- Click the green chat button (bottom-right)
- Ask questions about crop health and disease detection
- Drag to reposition the chatbot widget

## API Endpoints

### Authentication
- `POST /login/` - User login
- `POST /register/` - User registration
- `POST /logout/` - User logout

### Dashboard
- `GET /dashboard/` - Main dashboard
- `GET /diseasedetection/` - Disease detection page
- `GET /analytics/` - Analytics page
- `GET /reports/` - Reports page

## Configuration

### Environment Variables
Update `.env` file with:
- `DEBUG` - Set to `False` in production
- `SECRET_KEY` - Django secret key
- `ALLOWED_HOSTS` - Allowed domain hosts
- `GROQ_API_KEY` - Groq API key for chatbot

### Chatbot Configuration
The chatbot is powered by Groq API. To enable:
1. Get your API key from [Groq Console](https://console.groq.com)
2. Add it to `.env` as `GROQ_API_KEY`
3. The chatbot will automatically use it

## Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

### Mobile Optimizations
- Touch-friendly buttons and inputs
- Responsive navigation menu
- Optimized chatbot for small screens
- Full-screen modal for mobile chatbot

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'django'"
**Solution**: Activate virtual environment and run `pip install -r requirements.txt`

### Issue: "Chatbot not responding"
**Solution**: Check that `GROQ_API_KEY` is set in `.env` file

### Issue: "Static files not loading"
**Solution**: Run `python manage.py collectstatic` in production

### Issue: "Responsive design issues on mobile"
**Solution**: Clear browser cache and refresh. Check viewport meta tag in HTML

## Future Enhancements
- [ ] Real-time crop monitoring with drone integration
- [ ] Advanced ML models for disease classification
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Payment integration for premium features
- [ ] Cloud database support

## Security
- CSRF protection enabled
- Password minimum 8 characters
- Email validation
- Secure session management
- Input sanitization

## Performance
- Optimized images
- Lazy loading for components
- Debounced search
- Efficient database queries
- CDN-ready static files

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Support
For issues and questions:
- Create an issue on GitHub
- Contact: mwebidouglas08-netizen

## Acknowledgments
- SmartAI Team
- Groq API for LLaMA AI model
- Django Framework
- Tailwind CSS

---

**Last Updated**: June 2026
**Version**: 1.0.0
