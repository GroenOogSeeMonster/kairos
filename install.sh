#!/bin/bash

# Kairos Installation Script
# This script sets up the Kairos application with all dependencies

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 18 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        return 1
    fi
}

# Function to check Docker
check_docker() {
    if command_exists docker; then
        print_success "Docker is installed"
        return 0
    else
        print_warning "Docker is not installed. You can still run the application locally."
        return 1
    fi
}

# Function to check Docker Compose
check_docker_compose() {
    if command_exists docker-compose; then
        print_success "Docker Compose is installed"
        return 0
    elif docker compose version >/dev/null 2>&1; then
        print_success "Docker Compose (v2) is available"
        return 0
    else
        print_warning "Docker Compose is not installed. You can still run the application locally."
        return 1
    fi
}

# Function to setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env from template"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Function to install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd backend
    
    if [ ! -d node_modules ]; then
        npm install
        print_success "Backend dependencies installed"
    else
        print_warning "Backend node_modules already exists, skipping..."
    fi
    
    cd ..
}

# Function to install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    cd frontend
    
    if [ ! -d node_modules ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_warning "Frontend node_modules already exists, skipping..."
    fi
    
    cd ..
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    cd backend
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL" .env; then
        DATABASE_URL=$(grep DATABASE_URL .env | cut -d'=' -f2)
        if [ "$DATABASE_URL" != "postgresql://username:password@localhost:5432/kairos" ]; then
            print_status "Running database migrations..."
            npx prisma generate
            npx prisma migrate dev --name init
            print_success "Database setup completed"
        else
            print_warning "Please update DATABASE_URL in backend/.env before running migrations"
        fi
    else
        print_warning "DATABASE_URL not found in backend/.env"
    fi
    
    cd ..
}

# Function to build Docker images
build_docker() {
    if check_docker && check_docker_compose; then
        print_status "Building Docker images..."
        docker-compose build
        print_success "Docker images built successfully"
    else
        print_warning "Skipping Docker build (Docker not available)"
    fi
}

# Function to create start scripts
create_start_scripts() {
    print_status "Creating start scripts..."
    
    # Local development start script
    cat > start-local.sh << 'EOF'
#!/bin/bash
echo "Starting Kairos in local development mode..."

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Kairos is starting up..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF
    chmod +x start-local.sh
    
    # Docker start script
    if check_docker && check_docker_compose; then
        cat > start-docker.sh << 'EOF'
#!/bin/bash
echo "Starting Kairos with Docker..."

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "Error: backend/.env not found. Please run install.sh first."
    exit 1
fi

# Start services
docker-compose up -d

echo "Kairos is starting up..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
EOF
        chmod +x start-docker.sh
    fi
    
    print_success "Start scripts created"
}

# Function to display next steps
show_next_steps() {
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Configure your environment:"
    echo "   - Edit backend/.env with your database and API keys"
    echo "   - Edit frontend/.env with your Google OAuth client ID"
    echo ""
    echo "2. Start the application:"
    if [ -f start-local.sh ]; then
        echo "   - Local development: ./start-local.sh"
    fi
    if [ -f start-docker.sh ]; then
        echo "   - Docker: ./start-docker.sh"
    fi
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:3001"
    echo ""
    echo "4. Optional: Set up your database"
    echo "   - Update DATABASE_URL in backend/.env"
    echo "   - Run: cd backend && npx prisma migrate dev"
    echo ""
    echo "For more information, see README.md and SETUP_GUIDE.md"
}

# Main installation function
main() {
    echo "🚀 Kairos Installation Script"
    echo "=============================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! check_node_version; then
        print_error "Please install Node.js 18 or higher and try again."
        exit 1
    fi
    
    check_docker
    check_docker_compose
    
    echo ""
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_backend
    install_frontend
    
    # Setup database (optional)
    setup_database
    
    # Build Docker images (optional)
    build_docker
    
    # Create start scripts
    create_start_scripts
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@" 