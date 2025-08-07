# App manager 
This is a simple app manager that allows you to create, update, and delete applications. It also provides functionality to toggle the status of applications between running and stopped. The initial intention for this project was to create a dashboard for managing applications, but it has capable of running applications.
# Features
- Create applications
- Update applications
- Delete applications
- Toggle application status between running and stopped 
# Technologies Used
- Next.js
- React
- TypeScript
- Lucide Icons
- Tailwind CSS
- FastAPI for backend operations
# Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ``` 
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
4. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
# Usage
- Open your browser and navigate to `http://localhost:3000` to access the application
- Use the provided UI to create, update, delete, and manage applications
# Future Improvements
- Develop a running application feature that allows users to run applications directly from the dashboard (you can use docker container, link to the application or cloud service)
- Enhance the UI with more features and better user experience
- Implement user authentication and authorization
- Add more detailed application management features
# Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
# License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
# Acknowledgements
- Thanks to the Next.js and FastAPI communities for their excellent documentation and support.
- Special thanks to the contributors who have helped improve this project.
# Contact
For any questions or feedback, please reach out to [phungminhchi2005@gmail.com](mailto:phungminhchi2005@gmail.com).