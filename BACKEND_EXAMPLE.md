# Backend Implementation Example

This document provides examples of how to implement the backend API that this admin interface requires.

## Technology Stacks

You can implement the backend using any technology stack. Here are some popular options:

### Node.js (Express + PostgreSQL)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Articles endpoint
app.get('/api/v1/articles', async (req, res) => {
  const { page = 1, page_size = 20 } = req.query;
  const offset = (page - 1) * page_size;
  
  const result = await pool.query(
    'SELECT * FROM articles ORDER BY created DESC LIMIT $1 OFFSET $2',
    [page_size, offset]
  );
  
  res.json({
    count: result.rowCount,
    results: result.rows
  });
});

app.post('/api/v1/articles', authenticate, async (req, res) => {
  const { headline, body, deckhead } = req.body;
  
  const result = await pool.query(
    'INSERT INTO articles (headline, body, deckhead, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [headline, body, deckhead, req.user.id]
  );
  
  res.status(201).json(result.rows[0]);
});
```

### Python (Django Rest Framework)

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):
    headline = models.CharField(max_length=200)
    deckhead = models.CharField(max_length=300, blank=True)
    body = models.TextField()
    published = models.BooleanField(default=False)
    publish_date = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    authors = models.ManyToManyField('Author', related_name='articles')
    tags = models.ManyToManyField('Tag', related_name='articles')
    
class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    bio = models.TextField(blank=True)
    slug = models.SlugField(unique=True)

# serializers.py
from rest_framework import serializers
from .models import Article, Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Article
        fields = '__all__'

# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Article, Author
from .serializers import ArticleSerializer, AuthorSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Article.objects.all()
        published = self.request.query_params.get('published')
        if published is not None:
            queryset = queryset.filter(published=published == 'true')
        return queryset

# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, AuthorViewSet

router = DefaultRouter()
router.register('articles', ArticleViewSet)
router.register('authors', AuthorViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
```

### Ruby on Rails

```ruby
# app/models/article.rb
class Article < ApplicationRecord
  has_and_belongs_to_many :authors
  has_and_belongs_to_many :tags
  has_many :comments
  
  validates :headline, presence: true
  
  scope :published, -> { where(published: true) }
  scope :draft, -> { where(published: false) }
end

# app/controllers/api/v1/articles_controller.rb
module Api
  module V1
    class ArticlesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_article, only: [:show, :update, :destroy]
      
      def index
        @articles = Article.page(params[:page]).per(params[:page_size] || 20)
        render json: {
          count: @articles.total_count,
          results: @articles
        }
      end
      
      def create
        @article = Article.new(article_params)
        if @article.save
          render json: @article, status: :created
        else
          render json: { errors: @article.errors }, status: :unprocessable_entity
        end
      end
      
      private
      
      def article_params
        params.require(:article).permit(:headline, :deckhead, :body, :published, author_ids: [], tag_ids: [])
      end
      
      def set_article
        @article = Article.find(params[:id])
      end
    end
  end
end
```

### Go (Gin + GORM)

```go
// models/article.go
package models

import (
    "time"
    "gorm.io/gorm"
)

type Article struct {
    ID          uint      `json:"pk" gorm:"primaryKey"`
    Headline    string    `json:"headline"`
    Deckhead    string    `json:"deckhead"`
    Body        string    `json:"body"`
    Published   bool      `json:"published"`
    PublishDate *time.Time `json:"publish_date"`
    CreatedAt   time.Time `json:"created"`
    UpdatedAt   time.Time `json:"updated"`
    Authors     []Author  `json:"authors" gorm:"many2many:article_authors;"`
    Tags        []Tag     `json:"tags" gorm:"many2many:article_tags;"`
}

// handlers/article.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "yourapp/models"
    "yourapp/database"
)

func GetArticles(c *gin.Context) {
    var articles []models.Article
    page := c.DefaultQuery("page", "1")
    pageSize := c.DefaultQuery("page_size", "20")
    
    db := database.GetDB()
    db.Preload("Authors").Preload("Tags").
       Offset((page - 1) * pageSize).
       Limit(pageSize).
       Find(&articles)
    
    c.JSON(http.StatusOK, gin.H{
        "count": len(articles),
        "results": articles,
    })
}

func CreateArticle(c *gin.Context) {
    var article models.Article
    
    if err := c.ShouldBindJSON(&article); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    db := database.GetDB()
    if err := db.Create(&article).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusCreated, article)
}

// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "yourapp/handlers"
    "yourapp/middleware"
)

func main() {
    r := gin.Default()
    
    api := r.Group("/api/v1")
    api.Use(middleware.AuthRequired())
    {
        api.GET("/articles", handlers.GetArticles)
        api.POST("/articles", handlers.CreateArticle)
        api.GET("/articles/:id", handlers.GetArticle)
        api.PUT("/articles/:id", handlers.UpdateArticle)
        api.DELETE("/articles/:id", handlers.DeleteArticle)
    }
    
    r.Run(":8000")
}
```

## Database Schema

Here's a basic PostgreSQL schema:

```sql
-- Authors table
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    headline VARCHAR(200) NOT NULL,
    deckhead VARCHAR(300),
    body TEXT NOT NULL,
    featured_caption TEXT,
    editors_note TEXT,
    punch_word VARCHAR(50),
    image_caption TEXT,
    image_url VARCHAR(500),
    full_article BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Many-to-many relationships
CREATE TABLE article_authors (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, author_id)
);

CREATE TABLE article_tags (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE article_sections (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, section_id)
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Revisions table
CREATE TABLE article_revisions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    headline VARCHAR(200),
    body TEXT,
    revision_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'author',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_article_authors_article_id ON article_authors(article_id);
CREATE INDEX idx_article_authors_author_id ON article_authors(author_id);
CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);
```

## Authentication Implementation

### JWT Authentication Example (Node.js)

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [username]
  );
  
  if (!user.rows[0]) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
  
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.rows[0].id, username: user.rows[0].username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      name: user.rows[0].name
    }
  });
});

// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## GraphQL Implementation (Optional)

If you prefer GraphQL over REST:

```javascript
// schema.graphql
type Article {
  id: ID!
  headline: String!
  deckhead: String
  body: String!
  published: Boolean!
  publishDate: String
  created: String!
  updated: String!
  authors: [Author!]!
  tags: [Tag!]!
}

type Author {
  id: ID!
  name: String!
  email: String!
  bio: String
  slug: String!
  articles: [Article!]!
}

type Query {
  articles(page: Int, pageSize: Int, published: Boolean): ArticleConnection!
  article(id: ID!): Article
  authors: [Author!]!
  author(id: ID!): Author
}

type Mutation {
  createArticle(input: ArticleInput!): Article!
  updateArticle(id: ID!, input: ArticleInput!): Article!
  deleteArticle(id: ID!): Boolean!
}

input ArticleInput {
  headline: String!
  deckhead: String
  body: String!
  published: Boolean
  authorIds: [ID!]
  tagIds: [ID!]
}
```

## Testing Your Backend

Use tools like Postman or curl to test your endpoints:

```bash
# Test authentication
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Test article creation
curl -X POST http://localhost:8000/api/v1/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"headline": "Test Article", "body": "Content..."}'

# Test article listing
curl http://localhost:8000/api/v1/articles?page=1&page_size=20 \
  -H "Authorization: Bearer YOUR_TOKEN"
```