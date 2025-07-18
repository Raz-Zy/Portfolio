# Personal Portfolio

A modern, responsive personal portfolio website built with Next.js and Tailwind CSS.

## Features

- **Responsive Design**: Fully responsive across all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Interactive Sections**: 
  - Hero section with call-to-action
  - About me with professional bio
  - Education timeline
  - Skills showcase (hard and soft skills)
  - Experience timeline
  - Contact form with social links
- **Performance Optimized**: Built with Next.js App Router for optimal performance
- **SEO Ready**: Proper metadata and semantic HTML structure

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Language**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Personal Information
Edit the following files to add your personal information:
- `src/sections/Hero.tsx` - Name, tagline, and profile
- `src/sections/About.tsx` - Professional bio and philosophy
- `src/sections/Education.tsx` - Educational background
- `src/sections/Skills.tsx` - Technical and soft skills
- `src/sections/Experience.tsx` - Work experience and projects
- `src/sections/Contact.tsx` - Contact information and social links

### Styling
- Colors and themes can be customized in `tailwind.config.js`
- Global styles are in `src/app/globals.css`
- Component-specific styles use Tailwind classes

### SEO
Update metadata in `src/app/layout.tsx` for better SEO.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── DarkModeToggle.tsx
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Education.tsx
│   ├── Skills.tsx
│   ├── Experience.tsx
│   └── Contact.tsx
├── lib/
└── types/
```

## Contributing

Feel free to fork this project and customize it for your own portfolio!

## License

This project is open source and available under the [MIT License](LICENSE).