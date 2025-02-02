# typeorm-mysql
Demo of user CRUD with typescript mysql and typeorm

# Mysql Database setup
1. Update package - sudo apt install mysql-server -y
2. Install Mysql database. Run command - sudo apt update && sudo apt upgrade -y
3. Secure Mysql Installation - sudo mysql_secure_installation
4. Start Mysql service - sudo systemctl start mysql
5. Access Mysql - sudo mysql -u root -p
6. Create database "mydatabase"

# Project Setup
1. Clone project - git clone <repository-url>
2. npm i
3. start the project by "npm run dev" (Migration file will auto run)

# API Route Sample:
Create a User:
    
    - Endpoint: /v1/users

    - Method: POST
    
    - Authorization (Token for Admin role): 
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczODUyNjExOX0.4D81-FzsjTyjHunZMr_UuUnXhQYzBCHbtTabPoGoFtE
    
    - Payload: 
    {
        "name": "Admin user",
        "email": "admin@gmail.com",
        "role": "Admin"
    }

# Run the test
1. npm test

# Other
1. Node.js with Express.js
2. TypeScript
3. MySQL
4. TypeORM

TypeORM provides built-in functions for easy database management and supports configuration options like the Singleton pattern for better maintainability.