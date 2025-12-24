# Deployment Guide

This guide will walk you through deploying your e-commerce website to Vercel with a custom domain, including security best practices.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Setting Up Supabase](#setting-up-supabase)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [Configuring Custom Domain](#configuring-custom-domain)
6. [Security Configuration](#security-configuration)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account (or GitLab/Bitbucket)
- ✅ A Vercel account (free tier works)
- ✅ A Supabase account (free tier works)
- ✅ A domain name (you can deploy first, then add domain later)
- ✅ Node.js installed locally (for testing)

---

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env` file in your project root (copy from `.env.example`):

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAILS=your-admin@email.com,another-admin@email.com
```

**⚠️ IMPORTANT:** Never commit `.env` to Git! It's already in `.gitignore`.

### 2. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test production build locally
npm run build
npm run preview
```

---

## Setting Up Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to initialize (~2 minutes)

### Step 2: Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
3. **DO NOT** copy the `service_role` key (keep it secret!)

### Step 3: Set Up Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `database-schema.sql`
3. Paste and run the SQL script
4. Verify tables were created: **Table Editor** → Check `profiles`, `reward_tasks`, `user_tasks`

### Step 4: Configure Authentication

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `https://yourdomain.com` (or Vercel URL temporarily)
   - **Redirect URLs**: 
     - `https://yourdomain.com/auth/callback`
     - `https://your-vercel-app.vercel.app/auth/callback`
3. If using Google OAuth:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Add your Google OAuth credentials

### Step 5: Configure Row Level Security (RLS)

✅ Your `database-schema.sql` already includes RLS policies, but verify:

1. Go to **Table Editor** → Select each table
2. Check **RLS Enabled** is ON
3. Review policies under **Policies** tab

**Security Note:** RLS ensures users can only access their own data. This is critical for multi-user applications.

---

## Deploying to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables:**
   - In Vercel project settings, go to **Settings** → **Environment Variables**
   - Add each variable:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     VITE_ADMIN_EMAILS = admin@example.com,admin2@example.com
     ```
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

4. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? (your-project-name)
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ADMIN_EMAILS

# Deploy to production
vercel --prod
```

---

## Configuring Custom Domain

### Step 1: Buy a Domain (if not done)

Popular registrars:
- **Namecheap** (recommended)
- **Google Domains**
- **Cloudflare** (includes free SSL)
- **GoDaddy**

### Step 2: Add Domain to Vercel

1. Go to your Vercel project → **Settings** → **Domains**
2. Enter your domain (e.g., `yourdomain.com`)
3. Click **Add**
4. Vercel will show DNS records to configure

### Step 3: Configure DNS

**Option A: Using Vercel Nameservers (Easiest)**

1. In Vercel, copy the nameservers shown
2. Go to your domain registrar
3. Find **DNS Settings** or **Nameservers**
4. Replace existing nameservers with Vercel's
5. Wait 24-48 hours for propagation

**Option B: Using A/CNAME Records (More Control)**

Add these DNS records at your registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Update Supabase Redirect URLs

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://yourdomain.com`
3. Add redirect URL: `https://yourdomain.com/auth/callback`
4. Save changes

### Step 5: Verify SSL Certificate

- Vercel automatically provisions SSL certificates via Let's Encrypt
- Wait 5-10 minutes after DNS propagation
- Your site should be accessible via HTTPS

---

## Security Configuration

### 1. Admin Access Protection

✅ **Already implemented!** Admin page is protected by:
- Authentication requirement
- Email-based access control

**To add admin users:**
1. Add their emails to `VITE_ADMIN_EMAILS` in Vercel environment variables
2. Format: `email1@example.com,email2@example.com` (comma-separated)
3. Redeploy after changes

### 2. Supabase Security

**✅ Row Level Security (RLS):**
- Already enabled in your schema
- Users can only access their own data
- Verify policies are active in Supabase dashboard

**✅ API Keys:**
- Only use `anon` key in frontend (already configured)
- Never expose `service_role` key
- Rotate keys if compromised: **Settings** → **API** → **Reset**

**✅ Authentication:**
- Enable email confirmation in Supabase:
  - **Authentication** → **Settings** → **Email Auth**
  - Enable **"Confirm email"**
- Set strong password requirements:
  - **Authentication** → **Settings** → **Password**
  - Minimum length: 8 characters
  - Require special characters

### 3. Environment Variables Security

**✅ Never commit:**
- `.env` files (already in `.gitignore`)
- API keys in code
- Passwords or secrets

**✅ Use Vercel Environment Variables:**
- Set in dashboard (not in code)
- Different values for Production/Preview/Development
- Rotate regularly

### 4. HTTPS & Security Headers

✅ **Already configured in `vercel.json`:**
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### 5. Database Security

**Best Practices:**
- ✅ Use RLS policies (already done)
- ✅ Use parameterized queries (Supabase client handles this)
- ✅ Limit API access with RLS
- ✅ Regular backups: **Settings** → **Database** → **Backups**

### 6. Rate Limiting

Consider adding rate limiting for:
- Login attempts
- Order submissions
- API calls

**Supabase provides built-in rate limiting** for auth endpoints.

---

## Post-Deployment

### 1. Test Critical Functions

- [ ] User registration/login
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout process
- [ ] Admin page access (with admin email)
- [ ] OAuth login (if configured)
- [ ] Email verification (if enabled)

### 2. Monitor Performance

- **Vercel Analytics:** Enable in project settings
- **Supabase Dashboard:** Monitor API usage and errors
- **Browser DevTools:** Check console for errors

### 3. Set Up Monitoring

**Recommended:**
- **Sentry** for error tracking
- **Vercel Analytics** for performance
- **Supabase Logs** for database issues

### 4. Backup Strategy

**Supabase:**
- Automatic daily backups (Pro plan)
- Manual backups: **Settings** → **Database** → **Backups**

**Code:**
- Use Git (GitHub/GitLab)
- Tag releases: `git tag v1.0.0`

---

## Troubleshooting

### Build Fails on Vercel

**Error: Missing environment variables**
- ✅ Check all `VITE_*` variables are set in Vercel
- ✅ Ensure variables are added to Production environment
- ✅ Redeploy after adding variables

**Error: Build timeout**
- ✅ Check `package.json` build script
- ✅ Reduce bundle size
- ✅ Check Vercel build logs

### Domain Not Working

**DNS not propagating:**
- Wait 24-48 hours
- Use [whatsmydns.net](https://www.whatsmydns.net) to check propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**SSL certificate not issued:**
- Ensure DNS is correctly configured
- Wait 5-10 minutes after DNS propagation
- Check Vercel domain settings

### Authentication Issues

**OAuth redirect not working:**
- ✅ Check redirect URLs in Supabase match your domain
- ✅ Ensure `VITE_SUPABASE_URL` is correct
- ✅ Check browser console for errors

**Users can't register:**
- ✅ Check Supabase email settings
- ✅ Verify email templates are configured
- ✅ Check spam folder for confirmation emails

### Admin Page Access Denied

**Even with correct email:**
- ✅ Check `VITE_ADMIN_EMAILS` in Vercel (case-insensitive)
- ✅ Ensure email matches exactly (including domain)
- ✅ Redeploy after changing environment variables
- ✅ Clear browser cache and cookies

### Database Connection Issues

**"Missing VITE_SUPABASE_URL" error:**
- ✅ Verify environment variables in Vercel
- ✅ Check variable names (must start with `VITE_`)
- ✅ Redeploy after adding variables

**RLS blocking queries:**
- ✅ Verify user is authenticated
- ✅ Check RLS policies in Supabase
- ✅ Review policy conditions

---

## Additional Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)
- **React Router:** [reactrouter.com](https://reactrouter.com)

---

## Security Checklist

Before going live, verify:

- [ ] All environment variables are set in Vercel
- [ ] `.env` is in `.gitignore` (never committed)
- [ ] Admin emails are configured
- [ ] Supabase RLS is enabled on all tables
- [ ] HTTPS is working (SSL certificate active)
- [ ] Email confirmation is enabled (recommended)
- [ ] Strong password requirements are set
- [ ] OAuth redirect URLs match your domain
- [ ] API keys are not exposed in client-side code
- [ ] Regular backups are configured

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Review browser console errors
4. Check this guide's troubleshooting section
5. Consult Vercel/Supabase documentation

---

**Last Updated:** 2024
**Version:** 1.0.0


