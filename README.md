# Angular Portfolio - Serhii Deineko

Modern frontend developer portfolio built with Angular 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Angular 19** - Latest Angular version with standalone components
- **TypeScript** - Strong typing for reliable code
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Angular Material** - Google's UI components
- **i18n** - Multi-language support (EN, UA, DE, FR, PL)
- **Responsive Design** - Adaptive design for all devices
- **Dark/Light Theme** - Theme switching
- **Smooth Animations** - Smooth animations and transitions
- **Firebase Hosting** - Firebase deployment

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Main components
│   │   ├── header/         # Navigation bar
│   │   ├── hero/           # Main section
│   │   ├── projects/       # Projects section
│   │   ├── experience/     # Experience section
│   │   └── contact/        # Contact form
│   ├── shared/             # Shared components and services
│   │   ├── components/     # Reusable components
│   │   ├── constants/      # Application constants
│   │   └── services/       # Services
│   └── services/           # Main services
├── assets/                 # Static resources
│   ├── i18n/              # Translation files
└── environments/           # Environment configuration
```

## 🛠 Tech Stack

### Core Technologies

- **Angular 19.1.0** - Framework
- **TypeScript 5.7.2** - Programming language
- **Tailwind CSS 3.4.4** - CSS framework
- **Angular Material 19.1.1** - UI library

### Additional Libraries

- **@ngx-translate** - Internationalization
- **RxJS** - Reactive programming
- **File-saver** - File saving
- **JSZip** - Archive handling
- **OpenAI** - AI integration

## 🚀 Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Angular CLI

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Development Server

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:4200`

### Production Build

```bash
yarn build
```

Prerenders the home page and every project page to static HTML into
`dist/browser` — this is exactly what gets deployed.

### Run Tests

```bash
npm test
# or
yarn test
```

## 🌐 Deployment

Pushing to `main` runs the GitHub Actions pipeline: lint → test → prerender →
verify artifacts → deploy to Firebase Hosting.

To deploy manually:

```bash
yarn global add firebase-tools
firebase login
yarn deploy
```

To preview the exact production output locally on http://127.0.0.1:5000:

```bash
yarn preview
```

See [DEPLOY.md](DEPLOY.md) for the full guide, including how direct links are
protected from 404s.

## 📱 Functionality

### Main Sections

- **Hero** - Welcome section with brief description
- **Projects** - Project portfolio with detailed descriptions
- **Experience** - Work experience and skills
- **Contact** - Contact information and contact form

### Additional Features

- **Multi-language** - Support for 5 languages
- **Dark/Light Theme** - Color scheme switching
- **Smooth Scrolling** - Section navigation
- **Responsive Design** - Optimization for all devices

## 🎨 Design

- Modern minimalist design
- Tailwind CSS for styling
- Angular Material for UI components
- Smooth animations and transitions
- Performance optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Serhii Deineko** - Angular Frontend Developer

- GitHub: [@serhii-deineko](https://github.com/serhii-deineko)
- Email: [Contact information in the app]

## 🤝 Contributing

Contributions to the project are welcome! Please create an issue or pull request for improvement suggestions.

---

_Created with ❤️ using Angular 19_
