# Admin Writing Interface

<div align="center">
  <img src="logo.jpg" alt="RIABiz Logo" width="200"/>
</div>

An open-source content management system for creating and managing articles, built with Next.js and TypeScript.

## About This Project

This admin writing interface was originally developed and used in production by [RIABiz](https://riabiz.com), the leading news and information platform serving the registered investment advisor (RIA) industry. RIABiz provides breaking news, in-depth analysis, and exclusive insights for financial advisors, asset managers, and industry professionals managing over $5 trillion in assets.

We've open-sourced this battle-tested content management system to give back to the community and help other organizations build robust editorial platforms.

## Features

- 📝 Rich text editor for article creation and editing
- 👥 Author and editor management
- 🏷️ Tag and section categorization
- 💾 Auto-save functionality
- 📜 Revision history tracking
- 💬 Comment system
- 🔍 Search functionality
- 📱 Responsive design
- 🔒 Authentication and authorization

## Prerequisites

- Node.js 16+
- npm or yarn
- A backend API that implements the required endpoints

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd admin-writing-interface
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
   - Set your API endpoints
   - Configure authentication secrets
   - Add file upload service credentials
   - Configure other services as needed

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Required Environment Variables

- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_PUBLIC_GRAPHQL_URL`: GraphQL endpoint (if using GraphQL)
- `SESSION_SECRET`: Secret for session encryption
- `JWT_SECRET`: Secret for JWT token generation
- `NEXTAUTH_SECRET`: NextAuth.js secret

### Optional Services

- **File Upload**: Configure Uploadcare or similar service
- **Email**: SMTP settings for notifications
- **Analytics**: Google Analytics, Sentry for error tracking

## API Requirements

Your backend API should implement the following endpoints:

### Articles
- `GET /api/v1/articles/` - List articles
- `POST /api/v1/articles/` - Create article
- `GET /api/v1/articles/:id` - Get article
- `PUT /api/v1/articles/:id` - Update article
- `DELETE /api/v1/articles/:id` - Delete article

### Authors
- `GET /api/v1/authors/` - List authors
- `POST /api/v1/authors/` - Create author
- `GET /api/v1/authors/:id` - Get author
- `PUT /api/v1/authors/:id` - Update author

### Tags
- `GET /api/v1/tags/` - List tags
- `POST /api/v1/tags/` - Create tag
- `GET /api/v1/tags/:id` - Get tag

### Sections
- `GET /api/v1/sections/` - List sections
- `POST /api/v1/sections/` - Create section

### Comments
- `GET /api/v1/comments/` - List comments
- `POST /api/v1/comments/` - Create comment

### Authentication
- `POST /rest-auth/login/` - User login
- `POST /rest-auth/logout/` - User logout
- `POST /rest-auth/password/reset/` - Password reset

## Project Structure

```
├── components/
│   ├── admin/          # Admin-specific components
│   ├── editor/         # Rich text editor
│   └── layouts/        # Layout components
├── pages/
│   └── admin/          # Admin pages
│       ├── index.tsx   # Admin dashboard
│       ├── articles/   # Article management
│       ├── create/     # Create article/brief
│       └── a/          # Article editor
├── utils/
│   ├── api.ts          # API utilities
│   └── article-helpers.tsx # Article helper functions
├── interfaces/         # TypeScript interfaces
├── config/            # Configuration files
└── styles/            # Global styles
```

## Development

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for linting
- Prettier for code formatting

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### Testing

Run tests:
```bash
npm run test
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Docker Support

Build and run with Docker:
```bash
docker build -t admin-writing .
docker run -p 3000:3000 admin-writing
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [GNU General Public License v2.0](LICENSE).

## Support

For support, please open an issue in the GitHub repository.