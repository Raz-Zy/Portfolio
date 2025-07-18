# Docker Deployment Guide

## 🐳 Docker Configuration

Your portfolio is now ready for containerized deployment with a lightweight, production-optimized Docker setup.

## 📦 What's Included

- **Dockerfile** - Multi-stage build for minimal production image
- **.dockerignore** - Optimized build context
- **docker-compose.yml** - Easy deployment orchestration
- **next.config.js** - Updated with standalone output

## 🚀 Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop the container
docker-compose down
```

Your portfolio will be available at `http://localhost:3000`

### 2. Build and Run with Docker Commands

```bash
# Build the image
docker build -t dara-portfolio .

# Run the container
docker run -d \
  --name dara-portfolio \
  -p 3000:3000 \
  --restart unless-stopped \
  dara-portfolio

# Check logs
docker logs -f dara-portfolio

# Stop the container
docker stop dara-portfolio
docker rm dara-portfolio
```

## 🔧 Docker Image Details

- **Base Image**: `node:18-alpine` (lightweight Alpine Linux)
- **Final Image Size**: ~150-200MB (vs ~1GB+ without optimization)
- **Security**: Runs as non-root user (nextjs:nodejs)
- **Performance**: Multi-stage build with dependency caching
- **Production**: Standalone output for minimal runtime

## 🌐 Deployment Options

### Option 1: Cloud Platforms

**Vercel (Recommended for Next.js)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway link
railway up
```

**Render**
- Push to GitHub
- Connect repository on Render
- Use Docker deployment

### Option 2: VPS/Server Deployment

**With Docker Compose**
```bash
# On your server
git clone your-repo
cd portfolio
docker-compose up -d
```

**With Docker + Nginx**
```bash
# Build and run
docker build -t portfolio .
docker run -d --name portfolio -p 3000:3000 portfolio

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/portfolio
```

### Option 3: Container Registries

**Docker Hub**
```bash
# Tag and push
docker tag dara-portfolio yourusername/dara-portfolio
docker push yourusername/dara-portfolio
```

**GitHub Container Registry**
```bash
# Login and push
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker tag dara-portfolio ghcr.io/username/dara-portfolio
docker push ghcr.io/username/dara-portfolio
```

## 🔐 Environment Variables

Create a `.env.local` file for environment variables:

```env
# GitHub API (if using GitHub section)
GITHUB_TOKEN=your_github_token

# Add other environment variables as needed
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

Update `docker-compose.yml` to use env file:
```yaml
env_file:
  - .env.local
```

## 📊 Production Optimizations

### 1. Health Check (Optional)
Add to Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### 2. Nginx Reverse Proxy
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream portfolio {
        server portfolio:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://portfolio;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 3. SSL/HTTPS with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🧪 Testing

### Local Testing
```bash
# Test build
docker build -t test-portfolio .

# Test run
docker run --rm -p 3000:3000 test-portfolio

# Test with environment variables
docker run --rm -p 3000:3000 --env-file .env.local test-portfolio
```

### Production Testing
```bash
# Test production build locally
npm run build
npm run start

# Test Docker production build
docker-compose -f docker-compose.prod.yml up
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill process
   kill -9 PID
   ```

2. **Permission denied**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Build fails**
   ```bash
   # Clear Docker cache
   docker system prune -a
   # Rebuild
   docker build --no-cache -t portfolio .
   ```

## 📈 Monitoring

### Docker Stats
```bash
# Check resource usage
docker stats

# Check container health
docker ps
docker inspect portfolio
```

### Logs
```bash
# View logs
docker logs -f dara-portfolio

# Tail logs
docker logs --tail 50 dara-portfolio
```

## 🔄 Updates

### Update Container
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Update Dependencies
```bash
# Update package.json
npm update

# Rebuild Docker image
docker build -t dara-portfolio .
```

---

Your portfolio is now ready for production deployment! Choose the deployment method that best fits your needs. 🚀 