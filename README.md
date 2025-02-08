# StoryTime Spark 🌟

**StoryTime Spark** is an AI-powered story generator designed to create engaging and imaginative stories for kids aged 0-2, 3-5, and 6-8 years. The stories are presented in a beautifully formatted storybook style, complete with AI-generated images to bring the tales to life. This project is built with Next.js as a full-stack framework, combining frontend, backend, and API integrations seamlessly.

## Features ✨

- **AI-Powered Story Generation:** Generate unique and creative stories tailored for different age groups (0-2, 3-5, 6-8 years).
- **Storybook Format:** Stories are displayed in a visually appealing storybook layout with AI-generated images.
- **Secure Payments:** Integrated Razorpay for seamless payment processing to purchase credits or premium features.
- **User Authentication:** Secure user authentication and management.
- **Responsive UI:** Modern and responsive user interface designed for both desktop and mobile devices.
- **Image Storage:** AI-generated images are securely stored and displayed in the storybook.
- **Credit System:** Users can purchase credits to generate stories and unlock premium features.

## Technologies Used 🛠️

### Frontend
- **Next.js 15:** Full-stack framework for building the frontend and backend.
- **NextUI:** Modern UI component library for building a responsive and visually appealing interface.
- **Tailwind CSS:** Utility-first CSS framework for styling.

### Backend
- **Next.js API Routes:** Built-in API routes for handling backend logic.
- **Drizzle ORM:** TypeScript ORM for database management.
- **Neon DB:** Serverless PostgreSQL database for storing user data and story metadata.

### AI Services
- **Gemini:** AI model for generating creative stories.
- **OpenAI DALL·E-3:** AI model for generating story images (accessed via Azure AI Foundry).

### Storage
- **Firebase Storage:** Secure storage for AI-generated images.

### Authentication
- **Clerk:** User authentication and management.

### Payments
- **Razorpay:** Payment gateway for handling credit purchases and premium features.

### Deployment
- **Vercel:** Hosting and deployment platform.

## Getting Started 🚀

### Prerequisites
Before running the project, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI (if using Firebase Storage)
- Azure AI Foundry account (for DALL·E-3 API access)
- Gemini API key
- Clerk account (for authentication)
- Razorpay account (for payments)

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/storytime-spark.git
cd storytime-spark
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
DATABASE_URL=your_neon_db_url
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open the app:

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure 📚

```plaintext
storytime-spark/
├── app/                  # Next.js app directory
│   ├── api/              # API routes (backend logic)
│   ├── components/       # Reusable components
│   ├── _context/         # React context providers
│   │   └── auth/         # Authentication context
│   ├── buy-credits/      # Page for purchasing credits
│   ├── contact-us/       # Page for contacting support
│   ├── create/           # Page for creating stories
│   ├── dashboard/        # User dashboard
│   ├── explore/          # Page for exploring stories
│   ├── pricing/          # Pricing page
│   ├── view-story/       # Page for viewing a story
│   ├── favicon.ico       # Favicon for the app
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page
│   └── provider.tsx      # Context providers wrapper
├── config/               # Configuration files
│   ├── db.ts             # Database configuration
│   ├── firebaseConfig.ts # Firebase configuration
│   ├── geminiA1.ts       # Gemini AI configuration
│   └── schema.ts         # Database schema
├── node_modules/         # Installed dependencies
├── public/               # Static assets
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## How It Works 🧠

### User Authentication
- Users sign up or log in using Clerk.
- Authenticated users can generate and view stories.

### Story Generation
- Users select an age group (0-2, 3-5, 6-8 years).
- The app sends a request to the Gemini API to generate a story tailored for the selected age group.

### Image Generation
- Once the story is generated, the app sends a request to OpenAI DALL·E-3 (via Azure AI Foundry) to create images for the story.
- Generated images are stored in Firebase Storage.

### Storybook Display
- The story and images are displayed in a storybook format using NextUI components.

### Payments
- Users can purchase credits using Razorpay to generate more stories or unlock premium features.

### Database Storage
- Story metadata (e.g., title, age group, user ID) is stored in Neon DB using Drizzle ORM.

## Contributing 🤝

We welcome contributions! If you'd like to contribute to **StoryTime Spark**, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Submit a pull request.

## License 📝

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments 🙏

- **Gemini** for story generation.
- **OpenAI DALL·E-3** for image generation.
- **Clerk** for seamless user authentication.
- **Razorpay** for secure payment processing.
- **NextUI** for beautiful UI components.
- **Neon DB and Drizzle ORM** for efficient database management.

## Live Demo 🌐

Check out the [live demo of StoryTime Spark](#) here.

Enjoy creating magical stories with StoryTime Spark! ✨📚
