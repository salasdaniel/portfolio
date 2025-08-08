# Portfolio Platform

A modern portfolio management platform built with Laravel and React, allowing users to create and showcase their professional profiles, projects, skills, and experience.

## Features

- **Portfolio Management**: Create and manage your professional portfolio
- **Project Showcase**: Display projects with technologies, live demos, and repositories
- **Skills & Experience**: Organize programming languages, frameworks, databases, and work experience
- **Education & Certifications**: Track educational background and certifications
- **Public Profiles**: Share your portfolio via custom username URLs
- **Contact Integration**: Built-in contact forms for client inquiries
- **Responsive Design**: Mobile-first design with modern UI components

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **Styling**: Tailwind CSS, Radix UI, Shadcn/ui
- **Database**: PostgreSQL
- **Build Tools**: Vite, ESLint, Prettier

## Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite extension for PHP

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate --seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Laravel server
   php artisan serve
   
   # Terminal 2: Vite dev server
   npm run dev
   ```

7. **Access the application**
   - Application: http://localhost:8000
   - Register an account and start building your portfolio

## Usage

### Creating Your Portfolio

1. **Register/Login**: Create an account or login to access the dashboard
2. **Profile Setup**: Complete your professional information in Settings → Profile
3. **Add Experience**: Navigate to Experiences to add work history, education, and skills
4. **Create Projects**: Add your projects with descriptions, technologies, and links
5. **Share Portfolio**: Your portfolio will be available at `/{username}`

### Managing Content

- **Dashboard**: Overview of your portfolio statistics
- **Projects**: Create, edit, and organize your project showcase
- **Experience**: Manage work experience, education, skills, and certifications
- **Profile Settings**: Update personal information, contact details, and preferences

### Public Portfolio Features

- **Project Filtering**: Filter projects by programming language, framework, or database
- **Contact Form**: Visitors can contact you directly through your portfolio
- **Responsive Layout**: Optimized for desktop and mobile viewing
- **Custom Themes**: Personalize your portfolio appearance

## Development

### Available Scripts

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
composer run dev     # Alternative Laravel development command
```

### Database Management

```bash
php artisan migrate           # Run migrations
php artisan migrate:fresh    # Fresh migration
php artisan db:seed          # Seed database
```

### Testing

```bash
php artisan test            # Run PHP tests
npm run test               # Run JavaScript tests (if configured)
```

## Project Structure

```
├── app/                    # Laravel application logic
│   ├── Http/Controllers/   # API and web controllers
│   ├── Models/            # Eloquent models
│   └── Mail/              # Email classes
├── database/              # Migrations, seeders, factories
├── resources/
│   ├── js/                # React components and pages
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Page layouts
│   │   └── pages/         # Application pages
│   └── views/             # Blade templates
├── routes/                # Route definitions
└── public/                # Static assets
```

## Key Features

- **Multi-user Platform**: Each user gets their own portfolio space
- **Technology Tracking**: Comprehensive system for programming languages, frameworks, and databases
- **Project Management**: Rich project details with categorization and filtering
- **Experience Timeline**: Chronological work and education history
- **Skill Assessment**: Rate and categorize technical skills
- **Contact Integration**: Built-in contact forms and email handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

daniel@noko.com.py
