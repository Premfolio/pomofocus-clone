@echo off
echo 🚀 Setting up Pomofocus Clone...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please update the .env file with your configuration
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update the .env file with your MongoDB URI and JWT secret
echo 2. Start MongoDB (local or use MongoDB Atlas)
echo 3. Run 'npm run dev' to start the development servers
echo 4. Open http://localhost:3000 in your browser
echo.
echo For deployment instructions, see DEPLOYMENT.md
pause 