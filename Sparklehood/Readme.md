# AI Safety Incident Dashboard

This project is a web application designed to track and manage AI safety incidents. It provides features like real-time notifications, dark mode, and presence indicators to enhance user experience.

## Features

- **Dark Mode Toggle**: Easily switch between light and dark themes using a toggle button.
- **Real-Time Notifications**: Stay updated with new incidents through a bell icon with a badge count.
- **Presence Indicators**: View active users with animated avatar clusters.
- **Incident Management**: Add, filter, and sort incidents based on severity and date.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bajpaisandarbh/Sparklehood
   cd sparklehood
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### Building for Production

To build the project for production:

```bash
npm run build
```

The output will be in the `.next` directory.

### Testing

To run tests (if applicable):

```bash
npm test
```

## Language/Framework

This project is built using:

- **Language**: TypeScript
- **Framework**: [Next.js](https://nextjs.org/) (v15.2.3)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Design Decisions and Challenges

- **Dark Mode Toggle**: Implemented using a toggle switch with icons for better user experience.
- **Real-Time Notifications**: Added a bell icon with a badge count for new incidents.
- **Presence Indicators**: Animated avatar clusters to show active users.
- **Tooling**: Used `framer-motion` for animations and `lucide-react` for icons.

## Folder Structure

The project follows a modular structure for better maintainability:

- **`src/app/`**: Contains the main application files like `layout.tsx` and `page.tsx`.
- **`src/components/ui/`**: Reusable UI components like buttons, modals, and tooltips.
- **`src/hooks/`**: Custom React hooks for specific functionalities.
- **`src/lib/`**: Utility functions and helpers.
- **`src/ai/`**: AI-related logic and configurations.

## How to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Github link

https://github.com/Bajpaisandarbh/Sparklehood
