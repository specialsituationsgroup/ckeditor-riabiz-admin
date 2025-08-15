/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

// Application Configuration
// This file contains all the configuration needed for the admin writing interface

export const AppConfig = {
    // Application name
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Admin Writing Interface",
    
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/",
        graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql",
        apiKey: process.env.API_KEY || "",
        timeout: parseInt(process.env.API_TIMEOUT || "30000"),
    },
    
    // Authentication
    auth: {
        sessionSecret: process.env.SESSION_SECRET || "your-session-secret",
        jwtSecret: process.env.JWT_SECRET || "your-jwt-secret",
        tokenExpiry: process.env.TOKEN_EXPIRY || "7d",
    },
    
    // File Upload Configuration (Uploadcare or similar)
    fileUpload: {
        publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "",
        secretKey: process.env.UPLOADCARE_SECRET_KEY || "",
        cdnUrl: process.env.NEXT_PUBLIC_UPLOADCARE_CDN_URL || "https://ucarecdn.com/",
    },
    
    // Editor Configuration
    editor: {
        autoSaveInterval: parseInt(process.env.EDITOR_AUTOSAVE_INTERVAL || "30000"),
        maxRevisions: parseInt(process.env.MAX_REVISIONS || "50"),
    },
    
    // Feature Flags
    features: {
        enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true",
        enableRevisions: process.env.NEXT_PUBLIC_ENABLE_REVISIONS === "true",
        enableAutoSave: process.env.NEXT_PUBLIC_ENABLE_AUTOSAVE === "true",
        enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH === "true",
    },
    
    // Pagination
    pagination: {
        defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || "20"),
        maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || "100"),
    },
    
    // SEO Configuration
    seo: {
        defaultTitle: process.env.NEXT_PUBLIC_DEFAULT_TITLE || "Admin",
        defaultDescription: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION || "Content Management System",
        noIndex: true, // Admin pages should not be indexed
    }
};

export default AppConfig;