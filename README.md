

# URL Shortner API Setup Guide

This guide provides step-by-step instructions on how to set up and run the URL shortner App API in your machine. This API allow to shorten the given the given url, visit the given url using shortId
and get the analytics about the visitors.



## Pre-requisites
Before you begin, ensure you have the following installed on your machine:
* Node.js (v18 or higher)
* MongoDB (local instance or access to a remote server provided by atlas etc.)




## Getting Started

### 1. Clone the Repository
Clone the repository from GitHub to your local machine using the following command:

```shell
https://github.com/chuphal/url-shortner.git
```

Navigate into the project directory:
```shell
cd url-shortner
```
### 2. Install Dependencies
Install the required dependencies using npm:

```shell
npm install
```
### 3. Configure Environment Variables
Create a .env file in the root directory of the project and configure the necessary environment variables. Use the provided .env.example file as a template:

```text
# Server port
PORT=5000

MONGO_URI=your_mongo_uri
REDIS_URI=your_redis_uri
REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password
REDIS_PORT=28606

```


#### 4. Start the Server
Start the server using the following command:
```shell
npm run server
#or 
npm start
```
#### 5. Verify the Setup
Open your browser and navigate to http://localhost:5000/api-docs to access the API documentation (if Swagger is set up). You can also use Postman or another API client to test the endpoints.


## API Documentation
The API documentation provides detailed information about the available endpoints, request/response formats mechanisms. Access it at http://localhost:5000/api-docs.

## Development
### Code Structure

* "./" - Contains the source code
    * "controllers/" - Route handlers
    * "db/" -  db config
    * "errors/" - error handlers
    * "routes/" - API routes
    * "middlewares/" - Middleware functions
    * "utils/" - Utility functions

### Scripts
* "npm start" - Start the server
* "npm run server" - start the server with nodemon

### Deployed link
You can test the API's without setup.
* Go to the link:  [https://bidding-app-h0xs.onrender.com]
* Click on documentation
You can also use the postman to test the endpoints.

## Contact
Email: - [cchuphal4@gmail.com]


# Thank you !!