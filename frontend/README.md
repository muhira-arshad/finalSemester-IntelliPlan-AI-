# IntelliPlan AI Website

Welcome to the IntelliPlan AI website repository! This project is an AI-powered platform designed to revolutionize architectural design by generating stunning 2D and 3D floor plans from simple textual descriptions. It aims to provide an intuitive and immersive experience for architects, designers, and homeowners alike.

## ✨ Features

*   **AI-Powered Floor Plan Generation**: Leverage advanced AI to transform natural language descriptions into detailed and accurate 2D and 3D floor plans.
*   **Interactive 3D Canvas**: A dynamic 3D environment where users can visualize and interact with their generated floor plans in real-time, with pan, zoom, and rotate controls.
*   **Intuitive Parameter Input**: A well-structured and aesthetically pleasing form for users to input specific requirements like plot size, number of rooms, layout style, and more.
*   **Dynamic Home Page Animations**: Engaging scroll-driven transitions on the home page, showcasing the evolution from a video demo to 2D and 3D visualizations.
*   **Responsive Design**: Optimized for various screen sizes, ensuring a seamless experience on desktop, tablet, and mobile devices.
*   **Authentication System**: Secure user sign-in and sign-up flows with user profile management.
*   **Gallery**: Explore a collection of AI-generated floor plans created by other users.
*   **Flexible Pricing Plans**: Detailed pricing section with highlighted plans and clear feature breakdowns.
*   **Theme Toggle**: Switch between light and dark modes for a personalized viewing experience.
*   **Smooth Scrolling**: Enhanced navigation experience with smooth scroll animations.

## 🚀 Technologies Used

This project is built using modern web technologies and best practices:

*   **Next.js**: A React framework for building performant and scalable web applications, utilizing the App Router for routing and server components.
*   **React**: A JavaScript library for building user interfaces.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Framer Motion**: A production-ready motion library for React to power animations.
*   **React Three Fiber (Three.js)**: A powerful library for building 3D graphics in React, used for the interactive floor plan canvas and background effects.
*   **@react-three/drei**: A collection of useful helpers and abstractions for React Three Fiber.
*   **GSAP (GreenSock Animation Platform)**: A robust JavaScript animation library used for complex timeline-based animations.
*   **@studio-freight/lenis**: A smooth scrolling library for a better user experience.
*   **Lucide React**: A collection of beautiful and customizable open-source icons.

## 🛠️ Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites

*   Node.js (v18.x or later)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd intelliplan-ai-website
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add any necessary environment variables (e.g., for authentication, API keys). For this project, you might need:
    \`\`\`
    # Example (if you integrate with a backend/auth provider)
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    \`\`\`

### Running the Development Server

To start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💡 Usage

*   **Home Page**: Explore the features, gallery, and pricing plans. Experience the dynamic scroll animations.
*   **Generate Page**: Input your floor plan requirements using the intuitive form on the right. Interact with the empty 3D canvas on the left, which will eventually display your generated floor plan.
*   **Authentication**: Sign up for a new account or sign in to access personalized features like generating floor plans.
*   **Gallery**: View a curated collection of AI-generated floor plans.
*   **Theme Toggle**: Use the toggle in the navigation bar to switch between light and dark modes.

## 🤝 Contributing

We welcome contributions! If you have suggestions for improvements or new features, please feel free to open an issue or submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
