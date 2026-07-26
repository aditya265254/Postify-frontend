🚀 Postify — Frontend
Postify is a modern, feature-rich social media and content sharing web application built with React. It features real-time interactions, Google OAuth authentication, role-based access control (User and Admin), and a robust built-in content moderation and appeal system.

✨ Key Features
👤 User Features
Authentication: Secure login, signup, email verification, and Google OAuth integration.

Interactive Feed: Browse public posts, like, comment, and share posts seamlessly.

Content Management: Create rich text/image posts and view/manage them in the "My Posts" section.

Moderation Notifications: Instant pop-up warnings upon login if an admin has soft-deleted any of your posts, with the ability to submit a clarification/appeal.

🛡️ Admin & Moderation Features
Centralized Admin Dashboard: Real-time platform statistics including Total Users, Total Platform Posts, and a Pending Appeals Queue.

Content Moderation: Ability to inspect individual user histories, apply soft deletes with custom reasons, restore content, or permanently delete posts.

Protected Routes: Strict route guarding ensuring only authorized administrators can access the admin panel.

🛠️ Tech Stack
Framework: React.js (Vite)

Routing: React Router DOM

Styling: Tailwind CSS

HTTP Client: Axios

Notifications: React Toastify

📁 Project Structure
Plaintext
src/
├── config/
│   ├── api.js           # Axios instance configuration & base URL
│   └── post.api.js      # Centralized API endpoints for posts and dashboard
├── pages/
│   ├── AdminDashboard.jsx # Admin panel stats and pending appeals queue
│   ├── AdminUserPosts.jsx # Individual user moderation history and post actions
│   ├── CreatePost.jsx     # Post creation page
│   ├── Dashboard.jsx      # Main public feed and interactive post cards
│   ├── Login.jsx          # User login screen
│   ├── MyPosts.jsx        # Personal posts management & appeal submission
│   ├── Signup.jsx         # User registration screen
│   └── VerifyEmail.jsx    # Email verification screen
├── routes/
│   ├── AppRoutes.jsx      # Main application routing configuration
│   └── ProtectedAdminRoute.jsx # Admin guard component
├── App.jsx
├── main.jsx
└── index.css
⚙️ Getting Started & Installation
Follow these steps to set up and run the frontend locally on your machine.

Prerequisites
Make sure you have Node.js (v16 or higher) installed on your system.

1. Clone the Repository
Bash
git clone <your-repository-url>
cd <project-folder-name>
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory of your frontend project and specify your backend API base URL:

Code snippet
VITE_API_BASE_URL=http://localhost:3000/api/v1
4. Run the Development Server
Bash
npm run dev
Open your browser and navigate to http://localhost:5173 (or the port specified by Vite in your terminal).

🔄 Moderation & Appeal Workflow
Moderation: An admin can flag and soft-delete a post from the public feed or user profile, providing a specific reason.

Notification: The author receives a warning notification upon their next login.

Appeal: The user can visit "My Posts", view the removal reason, and submit a clarification/appeal.

Review: The appeal automatically lands in the Pending Appeals Queue on the Admin Dashboard for quick review, allowing the admin to either Restore or Delete Permanently.

📄 License
This project is open-source and available under the MIT License.