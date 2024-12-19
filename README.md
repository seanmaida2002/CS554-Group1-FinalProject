# Group 1 - CS-554-FinalProject
# Huddle Up Web Application

## Overview
Our project is a web application designed to help users find and connect with others in their area for pickup sports. Whether you’re looking for a basketball game at the local park or organizing a soccer match, this platform makes it easy to discover, join, and host events in your community.

### Key Features:
- **Browse Events**: Explore a forum of sports and look for events happening in your area.
- **Create Events**: Host your own events by providing details such as time, location, sport, an image, and additional information.
- **Sign-Up Functionality**: Users can sign up for events to indicate their participation.
- **Comments Section**: Ask questions or discuss details under each event.
- **Filter by Sport**: Easily find events based on your preferred sport.

By fostering communication and collaboration, this platform aims to build a stronger sense of community through shared sports activities.

## Hosting Information
Both the frontend and backend of the application are hosted on servers, allowing users to access the website via a link.

### Hosted Frontend Link
Access the hosted frontend here: [Frontend Link](http://huddleupcs554.s3-website.us-east-2.amazonaws.com)

For users who want to run the frontend locally, instructions are provided below.

## Local Development Setup
### Prerequisites
- [Node.js](https://nodejs.org) installed on your machine.
- A code editor like [VS Code](https://code.visualstudio.com/).

### Steps to Run Frontend Locally
## First Step is to make sure that Redis is running
1. **Go into a termal and run:**
    ```bash
    redis-cli
    ```
2. **Enter 'Ping' into the termainl and hit 'enter'. Redis should reply back with 'PONG'**
## Running the Server

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```
2. **Install all dependencies:**
    ```bash
    npm i
    ```
3. **Start Server:**
    ```bash
    npm start
    ```

## Running the Client

1. **Navigate to the client directory:**
   ```bash
    cd react_client
   ```
2. **Install all dependencies:**
    ```bash
    npm i
    ```
3. **Start Client:**
    ```bash
    npm run dev
    ```

