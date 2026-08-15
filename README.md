
# 🚀 SAI TEJA — 3D Developer Portfolio

[![3D Developer Portfolio](./Screenshot_2026-04-08_22-10-00.png)](./screen-capture%20(13).webm)

A premium, interactive **3D developer portfolio website** built with **React, TypeScript, Three.js, WebGL, GSAP, ScrollTrigger, and Lenis**.

The portfolio combines a cinematic loading experience, interactive 3D character, smooth scrolling, animated sections, responsive layouts, and a modern dark visual system to create a memorable developer experience.

> Built and designed by **Sai Teja Thanneeru**

---

## 🌐 Live Portfolio

**Portfolio:**  
https://saiteja-portfolio-mikey.vercel.app/

**GitHub:**  
https://github.com/SAITEJA-THANNEERU

**LinkedIn:**  
https://linkedin.com/in/saiteja-thanneeru


---

# ✨ Features

## 🎬 Cinematic Loading Experience

The portfolio begins with a custom loading experience before displaying the main landing page.

Features include:

- Animated loading screen
- Dynamic loading percentage
- Animated progress bar
- Glowing progress indicator
- Animated speeder
- Moving clouds
- Speed lines
- Loading status text
- Smooth loading-screen exit transition
- Landing page reveal after initialization

The loading experience creates a cinematic transition into the portfolio rather than immediately displaying the landing page.

---

# 🤖 Interactive 3D Character

The landing page features an interactive **3D character rendered using Three.js and WebGL**.

The character supports:

- Intro animation
- Typing animation
- Eye blinking
- Eyebrow interaction
- Cursor-based interaction
- Animated character states
- GLTF/GLB model rendering
- Bone-based animation control

The animation system separates specific bone animations so individual animations can run without unnecessarily controlling the entire character.

---

# 🖱️ Smooth Scrolling

The portfolio uses **Lenis** together with **GSAP** and **ScrollTrigger** for smooth scrolling and scroll-based animations.

The scrolling system provides:

- Smooth wheel scrolling
- Natural easing
- Scroll-based animations
- Section transitions
- GSAP synchronization
- ScrollTrigger integration
- Responsive behavior
- Native touch scrolling on mobile devices

GSAP's ticker is synchronized with Lenis to maintain a consistent animation loop.

---

# 🎨 Modern Visual Design

The portfolio uses a dark, futuristic visual system featuring:

- Near-black backgrounds
- Purple and lavender accent colors
- Soft gradients
- Atmospheric glows
- Glass-like surfaces
- Subtle borders
- Animated typography
- Hover interactions
- Minimal editorial layouts

The design is intentionally different from a traditional resume-style portfolio and focuses on creating an immersive digital experience.

---

# 📱 Responsive Design

The portfolio is designed to work across a wide range of devices.

Supported layouts include:

- Small mobile phones
- Large mobile phones
- Tablets
- Tablet landscape
- Laptops
- 15.6-inch laptops
- Desktop monitors
- Large desktop displays
- Full-screen browser layouts

Responsive behavior includes:

- Adaptive typography
- Responsive navigation
- Mobile navigation menu
- Responsive 3D character positioning
- Flexible section spacing
- Responsive project layouts
- Responsive career timeline
- Responsive education timeline
- Mobile-friendly interactions

---

# 🧭 Responsive Navigation

The portfolio includes a responsive navigation system.

### Desktop

Large screens use a horizontal navigation bar with access to the major portfolio sections.

### Mobile

Smaller devices use a dedicated mobile navigation menu to preserve screen space and usability.

The navigation also includes an interactive profile-image viewer.

---

# 🖼️ Profile Image Viewer

The profile image in the navigation can be clicked to open a dedicated image viewer.

The viewer is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile
- Portrait
- Landscape

The existing navigation functionality remains intact while allowing visitors to view the profile image separately.

---

# 👨‍💻 About

The landing section introduces:

**Sai Teja Thanneeru**

with a focus on:

- AI Engineering
- Data Analysis
- Software Development
- Full-Stack Development
- Interactive Web Experiences

The landing section also contains animated typography and an interactive 3D character.

---

# 💼 Career & Experience

The career section presents professional experience through an animated editorial timeline.

Each experience can include:

- Position
- Organization
- Period
- Description
- Timeline position
- Interactive styling
- External company link

One of the featured organizations is:

**SKAITE Technologies**

Website:

https://skaitetechnologies.in/

---

# 🎓 Education

The education section presents academic history in a timeline format.

### Bachelor of Technology

**Malla Reddy College of Engineering & Technology**

Computer Science & Engineering

**CGPA:** 7.94 / 10

---

### Intermediate

**Sri Kakatiya Junior College**

MPC

**Percentage:** 68.8%

---

### Secondary Education

**Krishnaveni Talent School**

**CGPA:** 9.8 / 10

---

# 🧠 Technical Skills

The portfolio presents technical skills across multiple areas.

### Programming

- Python
- Java
- JavaScript
- TypeScript
- C

### AI & LLM

- Prompt Engineering
- Gemini AI
- LLM Applications
- AI Agents
- RAG

### Web Development

- React
- HTML
- CSS
- JavaScript
- TypeScript

### Backend & Databases

- Supabase
- PostgreSQL
- Firebase
- REST APIs
- Cloudflare Workers

### Data & Machine Learning

- Pandas
- NumPy
- Scikit-learn
- Data Analysis

### Tools

- Git
- GitHub
- Linux
- VS Code

---

# 🛠️ Projects & Work

The portfolio contains a dedicated work/project section showcasing software development, AI, data science, and interactive projects.

Projects cover areas such as:

- Artificial Intelligence
- Data Science
- Full-Stack Development
- Machine Learning
- Web Applications
- Interactive Applications
- Game Development
- Developer Tools

The project structure is designed so projects can be updated without rebuilding the entire portfolio architecture.

---

# 🎮 Interactive Game Experience

The portfolio also includes an interactive game-oriented experience.

The game section adds an additional interactive layer to the portfolio while maintaining the same overall visual language.

The project demonstrates the ability to combine:

- Frontend development
- Interactive UI
- Game interfaces
- Responsive design
- User interaction
- Modern web technologies

---

# 📜 Certifications

The portfolio contains a dedicated certifications section for professional learning and technical credentials.

Certifications cover areas such as:

- Artificial Intelligence
- AI Foundations
- AI Agents
- Networking
- SQL
- Data Visualization
- Python

Certification data is maintained separately so additional certifications can be added easily.

---

# 📬 Contact

The portfolio provides dedicated channels for professional communication.

Visitors can connect through:

- Email
- LinkedIn
- GitHub
- Professional websites
- Social platforms

---

# 🏗️ Technology Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Three.js | 3D rendering |
| WebGL | Hardware-accelerated graphics |
| GSAP | Animation system |
| ScrollTrigger | Scroll-based animations |
| Lenis | Smooth scrolling |
| CSS3 | Styling and responsive layouts |
| HTML5 | Application structure |
| JavaScript | Application logic |
| Git | Version control |
| GitHub | Source control |
| Vercel | Production deployment |

---

# 📂 Project Structure

A simplified structure of the project:

```text
Saiteja_portfolio/
│
├── public/
│   ├── images/
│   └── models/
│
├── src/
│   │
│   ├── components/
│   │   ├── Character/
│   │   ├── Career.tsx
│   │   ├── Education.tsx
│   │   ├── Landing.tsx
│   │   ├── Loading.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   │
│   ├── components/
│   │   └── styles/
│   │       ├── Career.css
│   │       ├── Education.css
│   │       ├── Landing.css
│   │       ├── Loading.css
│   │       ├── Navbar.css
│   │       └── ...
│   │
│   ├── context/
│   │   └── LoadingContext.tsx
│   │
│   ├── data/
│   │   └── certifications.ts
│   │
│   ├── pages/
│   │   ├── Play.tsx
│   │   └── Play.css
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── config.ts
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── README.md
````

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

Verify the installations:

```bash
node --version
npm --version
git --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/SAITEJA-THANNEERU/Saiteja_portfolio.git
```

Move into the project directory:

```bash
cd Saiteja_portfolio
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL similar to:

```text
http://localhost:5173/
```

Open the URL in your browser.

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🔧 Customization

The portfolio is structured so the main content can be customized without rebuilding the entire application architecture.

## Developer Information

Developer configuration is maintained through:

```text
src/config.ts
```

Update information such as:

* Name
* Email
* Social links
* Experience
* Developer information

---

## Career

Career information can be updated through the experience configuration.

Typical fields include:

```text
position
company
period
description
```

---

## Education

Education entries can be updated inside:

```text
src/components/Education.tsx
```

The education structure supports:

* Institution
* Degree
* Field
* Score
* Skills
* Badge
* Timeline information

---

## Certifications

Certification data is maintained in:

```text
src/data/certifications.ts
```

New certifications can be added without changing the main certification component.

---

## Landing Page

The main landing page can be customized through:

```text
src/components/Landing.tsx
```

and:

```text
src/components/styles/Landing.css
```

---

## Loading Screen

The loading experience can be customized through:

```text
src/components/Loading.tsx
```

and:

```text
src/components/styles/Loading.css
```

The loading system controls:

* Progress percentage
* Loading animation
* Speeder
* Loading text
* Exit transition
* Loading state

---

# 🤖 3D Character

The 3D character system is located inside:

```text
src/components/Character/
```

The character system is responsible for:

* Loading the 3D model
* Rendering the Three.js scene
* Camera
* Lighting
* Animation mixer
* Intro animation
* Typing animation
* Blink animation
* Eyebrow animation
* Cursor interaction

Animation behavior is controlled using Three.js animation actions and filtered bone tracks.

---

# 🎞️ Animation Architecture

The portfolio combines multiple animation systems.

### GSAP

Used for:

* Text reveals
* Landing animations
* Section animations
* Navigation effects
* Scroll-triggered effects

### ScrollTrigger

Used for:

* Scroll-based animation
* Section transitions
* Timeline animations
* Element reveal effects

### Lenis

Used for:

* Smooth scrolling
* Scroll easing
* Scroll navigation
* GSAP synchronization

### Three.js

Used for:

* 3D rendering
* Character animation
* WebGL interactions

---

# 📱 Responsive Strategy

The website uses responsive CSS to adapt the interface to different screen sizes.

The layout is designed for:

```text
Small Mobile
Large Mobile
Tablet
Tablet Landscape
Laptop
15.6" Laptop
Desktop
Large Desktop
Fullscreen
```

The layout adapts:

* Typography
* Navigation
* Section spacing
* 3D character positioning
* Timeline layouts
* Project grids
* Buttons
* Cards
* Content widths

---

# ⚡ Performance

Performance considerations include:

* Vite production builds
* Hardware-accelerated WebGL rendering
* Optimized animation loops
* GSAP ticker synchronization
* Responsive layouts
* Conditional animation behavior
* Reduced unnecessary animation loops
* Native touch scrolling on mobile devices

The portfolio synchronizes Lenis with the GSAP ticker to maintain a consistent animation loop.

---

# 🔄 Git & Deployment Workflow

The project uses GitHub as the source repository and Vercel for production deployment.

The deployment workflow is:

```text
Local Development
       ↓
Git
       ↓
GitHub main branch
       ↓
Vercel
       ↓
Production Deployment
```

After making changes:

```bash
git add .
```

Commit the changes:

```bash
git commit -m "Update portfolio"
```

Push to GitHub:

```bash
git push origin main
```

Vercel automatically detects the new commit and starts a deployment when the repository is connected to the Vercel project.

---

# ☁️ Vercel Deployment

The project is designed to work with Vercel.

For a new deployment:

1. Import the GitHub repository into Vercel.
2. Select the project.
3. Use the Vite build configuration.
4. Deploy.

Typical build command:

```bash
npm run build
```

Typical output directory:

```text
dist
```

Once GitHub is connected to Vercel, pushing changes to the configured branch automatically triggers a new deployment.

---

# 🐛 Troubleshooting

## Development server doesn't start

Remove the existing dependencies and reinstall them.

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### macOS / Linux

```bash
rm -rf node_modules
npm install
npm run dev
```

---

## TypeScript or build errors

Run:

```bash
npm run build
```

The production build can reveal TypeScript and compilation issues that may not immediately appear during development.

---

## 3D model isn't appearing

Check:

* Model path
* Public asset path
* GLTF/GLB file
* Browser console
* Network tab
* Three.js loading errors
* Model file availability

---

## Animations aren't working

Check:

* GSAP imports
* ScrollTrigger registration
* Animation names inside the GLTF/GLB file
* Animation mixer
* Component lifecycle
* Browser console

---

## Smooth scrolling isn't working

Check:

* Lenis initialization
* GSAP ticker
* ScrollTrigger synchronization
* Whether another component is setting `overflow: hidden`
* Loading screen scroll lock
* Mobile/native scrolling behavior

---

# 🔐 Security

Do not commit sensitive information such as:

```text
.env
API keys
Private credentials
Database passwords
Secret tokens
Private certificates
```

Use environment variables for sensitive configuration.

---

# 🌟 Why This Portfolio?

Traditional developer portfolios often behave like digital resumes.

This project takes a different approach.

Instead of simply presenting:

```text
About
Skills
Projects
Experience
Contact
```

the portfolio attempts to turn the entire experience into an interactive product.

The goal is to demonstrate not only **what I know**, but also:

* How I build
* How I design
* How I approach interaction
* How I work with 3D
* How I approach animation
* How I combine engineering with visual design
* How I build responsive experiences

---

# 📸 Screenshots & Demo

Recommended screenshots for the repository:

```text
Landing Page
3D Character
Loading Screen
Career
Education
Tech Stack
Projects
Contact
Mobile Layout
```

The main preview image can be placed at:

```text
Screenshot_2026-04-08_22-10-00.png
```

A screen recording can also be linked from the repository.

---

# 🏷️ Recommended GitHub Topics

Add these topics to the repository:

```text
portfolio
developer-portfolio
portfolio-website
3d-portfolio
react
typescript
threejs
three-js
webgl
gsap
lenis
scrolltrigger
vite
frontend
frontend-development
javascript
responsive-design
interactive-portfolio
creative-developer
```

---

# 🤝 Contributing

This repository primarily represents my personal developer portfolio.

If you find a bug or have an improvement suggestion, feel free to open an issue or submit a pull request.

---

# ⭐ Support

If you find this project useful or inspiring:

* ⭐ Star the repository
* Fork the project
* Share it with other developers
* Connect with me on LinkedIn
* Give feedback or suggestions

Every bit of support is appreciated.

---

# 🤝 Connect With Me

### GitHub

[https://github.com/SAITEJA-THANNEERU](https://github.com/SAITEJA-THANNEERU)

### LinkedIn

[https://linkedin.com/in/saiteja-thanneeru](https://linkedin.com/in/saiteja-thanneeru)

### Portfolio

[https://saitejathanneeru.in/](https://saitejathanneeru.in/)

### SKAITE Technologies

[https://skaitetechnologies.in/](https://skaitetechnologies.in/)

---

# 📄 License

This project is available under the **MIT License**.

See the [`LICENSE`](LICENSE) file for more information.

---

# 👨‍💻 Author

## Sai Teja Thanneeru

**Software Engineer | AI Engineer | Data Analyst**

Interested in:

* Software Development
* Artificial Intelligence
* Data Analysis
* Full-Stack Development
* 3D Web Experiences
* Interactive Web Applications

---

<p align="center">
  Built with React, TypeScript, Three.js, GSAP & WebGL.
</p>

<p align="center">
  ⭐ If you like the project, consider starring the repository.
</p>

