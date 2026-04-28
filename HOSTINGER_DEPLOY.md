# Deploy ProposalKit to Hostinger VPS

## Requirements
- Hostinger VPS plan (minimum: KVM 1 — 1 vCPU, 4GB RAM)
- Ubuntu 22.04 LTS
- A domain pointed to your VPS

---

## Step 1 — Push code to GitHub

1. Create a new GitHub repository (e.g., `your-username/proposalkit`)
2. Run in your terminal:

```bash
cd proposalkit
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/proposalkit.git
git push -u origin main
```

---

## Step 2 — Set up your Hostinger VPS

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Create app directory
sudo mkdir -p /var/www/proposalkit
sudo chown $USER:$USER /var/www/proposalkit

# Clone your repo
cd /var/www
git clone https://github.com/YOUR_USERNAME/proposalkit.git proposalkit
cd proposalkit

# Create .env file on the server
nano .env
# (paste your production .env values — see .env.example)

# Install dependencies
npm ci

# Run DB migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start npm --name "proposalkit" -- start
pm2 save
pm2 startup
```

---

## Step 3 — Configure Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/proposalkit
```

Paste this config (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/proposalkit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 4 — Add SSL with Let's Encrypt (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Step 5 — Set GitHub Secrets for automatic deploys

In your GitHub repo → Settings → Secrets and variables → Actions, add:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your VPS IP address |
| `VPS_USER` | `root` or your VPS username |
| `VPS_SSH_KEY` | Your private SSH key (`cat ~/.ssh/id_rsa`) |
| `VPS_PORT` | `22` |
| `DATABASE_URL` | `file:./prod.db` |
| `AUTH_SECRET` | A random 32+ char string |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhooks |
| `STRIPE_PRO_PRICE_ID` | Your Stripe Pro price ID |
| `STRIPE_AGENCY_PRICE_ID` | Your Stripe Agency price ID |
| `ANTHROPIC_API_KEY` | From console.anthropic.com |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same as STRIPE_PUBLISHABLE_KEY |

---

## Step 6 — Set up Stripe Webhooks

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## How auto-deploy works

Every time you push to `main` branch on GitHub:
1. GitHub Actions builds your app
2. SSHs into your Hostinger VPS
3. Pulls latest code, runs migrations, rebuilds
4. Restarts PM2 automatically

Zero downtime deployment in ~2 minutes.
