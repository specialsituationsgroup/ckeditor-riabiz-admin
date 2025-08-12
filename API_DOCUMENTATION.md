# API Documentation

This document describes the API endpoints required by the Admin Writing Interface.

## Base URL

All API requests should be made to:
```
{NEXT_PUBLIC_API_URL}/api/v1
```

## Authentication

Most endpoints require authentication via Token or JWT:

```http
Authorization: Token {auth_token}
```
or
```http
Authorization: Bearer {jwt_token}
```

## Endpoints

### Articles

#### List Articles
```http
GET /articles/
```

Query Parameters:
- `page` (integer): Page number
- `page_size` (integer): Number of items per page
- `published` (boolean): Filter by published status
- `search` (string): Search in headline and body

Response:
```json
{
  "count": 100,
  "next": "http://api.example.com/articles/?page=2",
  "previous": null,
  "results": [
    {
      "pk": 1,
      "headline": "Article Title",
      "deckhead": "Article subtitle",
      "body": "Article content...",
      "published": true,
      "publish_date": "2024-01-01T00:00:00Z",
      "created": "2024-01-01T00:00:00Z",
      "updated": "2024-01-01T00:00:00Z",
      "authors": [],
      "tags": [],
      "sections": []
    }
  ]
}
```

#### Create Article
```http
POST /articles/
```

Request Body:
```json
{
  "headline": "New Article",
  "deckhead": "Subtitle",
  "body": "Content...",
  "published": false,
  "authors": [1, 2],
  "tags": [1, 2, 3],
  "sections": [1]
}
```

#### Get Article
```http
GET /articles/{id}/
```

#### Update Article
```http
PUT /articles/{id}/
PATCH /articles/{id}/
```

#### Delete Article
```http
DELETE /articles/{id}/
```

### Authors

#### List Authors
```http
GET /authors/
```

Response:
```json
{
  "count": 50,
  "results": [
    {
      "pk": 1,
      "name": "John Doe",
      "slug": "john-doe",
      "email": "john@example.com",
      "bio": "Author bio..."
    }
  ]
}
```

#### Create Author
```http
POST /authors/
```

Request Body:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "bio": "Author bio..."
}
```

### Tags

#### List Tags
```http
GET /tags/
```

Response:
```json
{
  "count": 100,
  "results": [
    {
      "pk": 1,
      "name": "Technology",
      "slug": "technology",
      "description": "Tech related articles"
    }
  ]
}
```

#### Create Tag
```http
POST /tags/
```

Request Body:
```json
{
  "name": "New Tag",
  "description": "Tag description"
}
```

### Sections

#### List Sections
```http
GET /sections/
```

Response:
```json
{
  "count": 10,
  "results": [
    {
      "pk": 1,
      "title": "News",
      "slug": "news",
      "published": true
    }
  ]
}
```

### Comments

#### List Comments for Article
```http
GET /comments/?article={article_id}
```

Response:
```json
{
  "count": 25,
  "results": [
    {
      "pk": 1,
      "article": 1,
      "author": "User Name",
      "content": "Comment text...",
      "created": "2024-01-01T00:00:00Z",
      "approved": true
    }
  ]
}
```

#### Create Comment
```http
POST /comments/
```

Request Body:
```json
{
  "article": 1,
  "content": "New comment...",
  "author": "User Name"
}
```

### Search

#### Search Articles
```http
GET /articles/search/?q={query}
```

Query Parameters:
- `q` (string): Search query
- `published` (boolean): Filter by published status
- `tags` (array): Filter by tag IDs
- `authors` (array): Filter by author IDs

### File Upload

The application uses Uploadcare or similar service for file uploads. Configure your upload service credentials in the environment variables.

#### Upload Image
Images are uploaded directly to the CDN service using the client-side widget.

### Authentication

#### Login
```http
POST /auth/login/
```

Request Body:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "auth_token_here",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Logout
```http
POST /auth/logout/
```

#### Password Reset Request
```http
POST /auth/password/reset/
```

Request Body:
```json
{
  "email": "user@example.com"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

## Filtering and Sorting

Most list endpoints support:
- `ordering`: Sort by field (prefix with `-` for descending)
- `search`: Full-text search
- Field-specific filters (e.g., `published=true`)

## Rate Limiting

API requests may be rate-limited. Check response headers:
- `X-RateLimit-Limit`: Maximum requests per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets