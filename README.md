# HeartHome

HeartHome is a comprehensive, patient-centered heart failure management and education companion. Designed with clinical expertise and compassion, it guides patients from initial diagnosis through long-term care by providing tools to track symptoms, manage complex medication regimens, and plan for the future.

![HeartHome Dashboard Mockup](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/heart.svg)

## 🩺 Key Features

- **Personalized Dashboard**: Visualize symptom trends (breathlessness, swelling) and weight fluctuations over time using interactive Recharts.
- **Daily Progress Logging**: A simple, intuitive interface for patients to record daily health metrics and "FACETS" symptoms.
- **Clinical Education**: In-depth, easy-to-understand articles on heart failure topics like ejection fraction, sodium intake, and activity levels.
- **Medication "Cocktail" Tracker**: Manage specialized heart medications with an adherence tracker and purpose-driven education for each prescription.
- **Care Circle (Contacts)**: Quick access to clinical care teams, triage nurses, and primary care physicians.
- **Future Planning**: Resources for advanced care planning, including direct integration with [MyDirectives.org](https://mydirectives.org) for living wills and health care proxies.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Inter (UI) & Playfair Display (Editorial)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/heart-home.git
   cd heart-home
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist/` folder.

## 🌐 Deploying to GitHub Pages

Since HeartHome is built with Vite, follow these steps to deploy to GitHub Pages:

1. Update your `vite.config.ts` to include the `base` property (replace `<REPO_NAME>` with your repository name):
   ```typescript
   export default defineConfig({
     base: '/<REPO_NAME>/',
     // ... other config
   })
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to the `gh-pages` branch. You can use the `gh-pages` package:
   ```bash
   npm install -D gh-pages
   ```
   Add a script to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
   Run:
   ```bash
   npm run deploy
   ```

## 📄 License

This project is for educational and clinical guidance purposes. Always consult with a medical professional for medical advice.

---

*Verified for Clinical Guidelines: AHA/HFSA 2024*
