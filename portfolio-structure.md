# PROJECT: Vinayak Koli – Dark Aesthetic Portfolio Website

## Global Design Requirements

- Theme: Dark aesthetic
- Primary Background Color: #0D0D0D
- Accent Color: Deep Red (#8B0000)
- Text Color: White (#FFFFFF) with soft gray for secondary text
- Style: Professional, minimal, clean
- Animation: Subtle fade-in on scroll only (no heavy animations)
- Responsive: Must work on mobile and desktop
- Smooth scrolling between sections

---

# SECTION 1 — HERO SECTION

## Layout:
- Full screen height (100vh)
- Background image: `hero-mountain.png` (located in root directory)
- Dark overlay (rgba(0,0,0,0.6)) for readability
- Centered text block

## Content:

### Main Heading (H1):
Vinayak Koli

### Subheading (H2):
Computer Science & Social Sciences  
IIIT Delhi

### Tagline (Paragraph):
Aspiring Software Engineer building scalable systems and intelligent solutions.

### Buttons:
- Button 1: "View Projects" → Scroll to Projects Section
- Button 2: "Download Resume" → Placeholder link (# for now)
- Button 3: "Contact Me" → Scroll to Contact Section

---

# SECTION 2 — ABOUT ME

## Layout:
- Two-column layout (desktop)
    Left: Image
    Right: Text
- Stack vertically on mobile

## Image:
`ninja-horse.png` (located in root directory)

## Text Content:

### Section Title (H2):
About Me

### Paragraph:
I am a second-year Computer Science and Social Sciences student at IIIT Delhi with a strong foundation in Java, Python, and system design. I enjoy building structured backend systems and solving real-world problems through clean and efficient code.

I am currently exploring scalable architectures, databases, and intelligent systems as I work toward becoming a professional Software Engineer.

---

# SECTION 3 — TECH STACK

## Layout:
- Grid layout (4 columns desktop, 2 mobile)
- Each tech item inside a dark card with subtle red hover glow

## Section Title:
Technical Skills

## Categories:

### Languages:
- Java
- Python
- SQL
- C++

### Tools & Technologies:
- Git
- Docker (placeholder)
- Linux
- VS Code

### Concepts:
- Object-Oriented Programming
- Data Structures
- Database Management Systems
- Basic AI/ML Concepts

---

# SECTION 4 — PROJECTS

## Layout:
- Card-based layout
- Each card includes:
    - Project Title
    - Short Description
    - Tech Stack
    - GitHub Link (placeholder)
    - Live Link (placeholder)

## Section Title:
Projects

## Dummy Projects:

### Project 1:
Title: University Course Registration System  
Description: Built a terminal-based system handling student, professor, and admin roles using OOP principles.  
Tech: Java, OOP  
GitHub: #

### Project 2:
Title: DBMS Simulation Platform  
Description: Designed SQL-based database interactions with query simulation and structured schema design.  
Tech: SQL, HTML, CSS, JavaScript  
GitHub: #

### Project 3:
Title: AI Classification Model  
Description: Implemented a basic classification model using Python and evaluated performance metrics.  
Tech: Python  
GitHub: #

---

# SECTION 5 — EDUCATION

## Layout:
Simple vertical timeline style.

## Section Title:
Education

### Entry 1:
IIIT Delhi  
B.Tech – Computer Science & Social Sciences  
(Expected Graduation Year: Placeholder)

### Entry 2:
KHMS  
Higher Secondary Education

---

# SECTION 6 — CONTACT

## Layout:
Centered minimal section

## Section Title:
Get In Touch

### Content:
Email: your-email@example.com  
LinkedIn: #  
GitHub: #  

Optional: Simple contact form (Name, Email, Message)

---

# FOOTER

- Dark background
- Copyright line:
© 2026 Vinayak Koli. All Rights Reserved.

---

# Technical Notes for Implementation

- Use semantic HTML5 structure (section, header, footer, nav)
- Use smooth scrolling behavior
- Use Intersection Observer for fade-in animations
- Use CSS variables for colors
- Ensure image optimization
- Keep performance optimized
- Clean typography hierarchy
- No excessive anime effects