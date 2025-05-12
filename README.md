# RemedyAI - AI-Powered Natural Health Solutions

![Natural Remedy](https://img.shields.io/badge/Natural-Remedy-brightgreen)
![Django](https://img.shields.io/badge/Django-5.2-green)
![Python](https://img.shields.io/badge/Python-3.x-blue)


RemedyAI is a web-based platform that connects users with natural, non-chemical remedies based on their health concerns. Our AI-powered chatbot provides personalized recommendations for herbs, natural treatments, and holistic practices tailored to your unique needs.


<div align="center">
 
  <a href="https://count.getloli.com/"><img src="https://count.getloli.com/get/@:MegumiinUwU-Natural-Remedy?theme=rule34" alt="visitor count" /></a>
</div>



## 🏆 Hackathon Achievement

RemedyAI was developed during the ALX Africa Hackathon (April 2025) and achieved the following milestones:

- **Fan Favorite Winner**: Selected as the most engaging and impactful solution by the community
- **Top 7 Finalist**: Chosen among all participating teams to pitch to the final panel of judges
- **48-Hour Development**: Successfully built and integrated:
  - Backend development
  - UI/UX design
  - Machine learning model integration
  - Real-time AI-powered recommendations

## 🎥 Demo Video

Check out our demo video to see RemedyAI in action:
[Watch Demo Video](demo/RemedyAI_Demo.mp4)

## 🌟 Features

- **AI Health Assistant**: Describe your symptoms in natural language and receive personalized natural remedy suggestions
- **Herb Encyclopedia**: Browse our comprehensive database of herbs, their benefits, and traditional uses
- **Wellness Knowledge**: Explore general health practices like cold therapy, mindfulness, and herbal teas
- **Holistic Approach**: Combining traditional wisdom with modern technology for complete wellness

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- pip (Python package installer)
- Virtual environment (recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RemedyAI.git
cd RemedyAI
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory and add necessary environment variables:
```
SECRET_KEY=your_secret_key
DEBUG=True
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start the development server:
```bash
python manage.py runserver
```

## 🛠️ Technology Stack

- **Backend**: Django 5.2
- **Frontend**: HTML, Tailwind CSS
- **AI/ML**: 
  - LangChain
  - Groq
  - Sentence Transformers
- **Database**: SQLite (development)
- **Additional Tools**:
  - ChromaDB for vector storage
  - PyTesseract for OCR
  - Pillow for image processing

## 📁 Project Structure

```
RemedyAI/
├── Core/                 # Core application functionality
├── GuestChat/           # Chat interface for non-registered users
├── Landing/             # Landing page and marketing content
├── media/              # User-uploaded media files
├── static/             # Static files (CSS, JS, images)
├── templates/          # HTML templates
├── herbal_chunks_VecDB/ # Vector database for herbal information
└── manage.py           # Django management script
```

## 🔧 Configuration

The project uses several key configurations:

1. **Django Settings**: Located in `RemedyAI/settings.py`
2. **URL Configuration**: Main URLs in `RemedyAI/urls.py`
3. **Static Files**: Configured in `settings.py` and served from `static/` directory
4. **Media Files**: Configured in `settings.py` and stored in `media/` directory



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

The information provided by RemedyAI is for educational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider before starting any new treatment or remedy.






