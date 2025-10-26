# 🚀 Migrating from Local MongoDB to Atlas for Render

## Your Current Situation

**Current Connection String:**

```env
MONGODB_URI=mongodb://127.0.0.1:27017/referral-system
```

**Problem:** This is local MongoDB (on your computer), Render can't access it! ❌

**Solution:** Use MongoDB Atlas (cloud database) ✅

---

## 🎯 Quick Migration Steps

### Step 1: Create MongoDB Atlas Account (5 minutes)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Sign up (use Google or email)
4. **Create a Project** (if you see "All Projects" page)
5. Create your first **M0 FREE** cluster

#### Step 1A: Create a Project (If Needed)

**If you see "All Projects" page:**

1. Click the **green "New Project" button** (top right)
2. Enter a project name (e.g., "Referral System" or "My App")
3. Optionally add team members (skip this for now)
4. Click **"Create Project"**
5. Now you're ready to create a cluster!

#### Step 1B: How to Create M0 FREE Cluster:

After creating a project, you'll see a page asking you to "Build a Database":

**Option 1: Quick Start**

1. Look for the big **"Build a Database"** button
2. Click on it
3. You'll see deployment options

**Option 2: From Dashboard**

1. If you're already in the dashboard
2. Click **"Create"** or **"New"** button
3. Select **"Database"**

**Now Follow These Steps:**

1. **Choose a deployment method:**

   - You'll see cards showing different tiers
   - Look for: **"FREE"** or **"M0"**
   - Click **"Create"** on the M0 FREE option
   - It will show: `$0.00/month` or `FREE FOREVER`

2. **Choose a Cloud Provider:**

   - You'll see: **AWS**, **Azure**, **Google Cloud**
   - Select **AWS** (most common)
   - Don't worry, it's free!

3. **Choose a Region:**

   - A map will appear with available regions
   - Look for your country/continent
   - Click on a region (e.g., `US East (N. Virginia)`)
   - Green checkmark will appear

4. **Choose a Cluster Name:**

   - There's a text box for cluster name
   - Default is `Cluster0`
   - You can keep this or rename it
   - Example: `referral-db`

5. **Click the "Create Cluster" button** (Bottom right)

   - Button will be green or blue
   - You'll see a loading screen
   - Status will show: "Your cluster is being created"

6. **Wait for creation (3-5 minutes):**
   - Progress bar will appear
   - Don't close the browser
   - When done, you'll see: "Your cluster is ready to go!"

**What you'll see when it's ready:**

- Green checkmark ✅
- Your cluster name appears
- Options: "Connect", "Browse Collections", etc.

**Troubleshooting:**

- Don't see M0 FREE option? You might need to go back and select "Free" tier
- Got an error? Make sure you completed account verification email
- Still creating after 10 minutes? Refresh the page

**You're done!** ✅ Now move to Step 2!

### Step 2: Get Your Atlas Connection String

After you create the database user, you'll see "Choose a connection method" page:

**Select: "Connect your application"** ✅

- This option is for connecting your code/app to the database
- You'll get a connection string that you can use in your `.env` file and Render

**Steps:**

1. Select **"Connect your application"** (not "Connect using MongoDB Compass" or other options)
2. Choose **"Node.js"** driver (should be selected by default)
3. Copy the connection string that looks like:
   ```
   mongodb+srv://koushik101517_db_user:<password>@cluster0.xxxxx.mongodb.net/
   ```
4. Replace `<password>` with your actual password: `XEdBhvWFUj6BqldX`

**Your final connection string will be:**

```
mongodb+srv://koushik101517_db_user:XEdBhvWFUj6BqldX@cluster0.xxxxx.mongodb.net/referral-system
```

**Important:** Add your database name at the end (`/referral-system`)

### Step 3: Configure Network Access

1. In Atlas dashboard, go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Create Database User

1. Go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Create user:
   - **Username**: Your choice
   - **Password**: Click "Autogenerate" and SAVE IT
   - **Role**: `Atlas admin` or `Read and write to any database`
4. Click **"Add User"**

### Step 5: Update Your Connection String

Your new connection string should look like:

```env
MONGODB_URI=mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/referral-system
```

**Note:** Add your database name at the end (`/referral-system`)

---

## 📦 Option 1: Keep Your Data (Export & Import)

### Export from Local MongoDB

1. Open terminal/command prompt
2. Navigate to where MongoDB tools are installed
3. Run export command:

```bash
mongoexport --host=127.0.0.1:27017 --db=referral-system --collection=users --out=users.json
mongoexport --host=127.0.0.1:27017 --db=referral-system --collection=referrals --out=referrals.json
mongoexport --host=127.0.0.1:27017 --db=referral-system --collection=credits --out=credits.json
mongoexport --host=127.0.0.1:27017 --db=referral-system --collection=purchases --out=purchases.json
```

### Import to Atlas

1. Get your Atlas connection string
2. Import each collection:

```bash
mongoimport --uri="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/referral-system" --collection=users --file=users.json
mongoimport --uri="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/referral-system" --collection=referrals --file=referrals.json
mongoimport --uri="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/referral-system" --collection=credits --file=credits.json
mongoimport --uri="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/referral-system" --collection=purchases --file=purchases.json
```

---

## 🆕 Option 2: Start Fresh (No Data Migration)

If you don't need to keep your existing data:

1. Just use the new Atlas connection string
2. Your application will create new collections on first use
3. Users will need to register again

---

## ✅ Update Your Application

### Local Development (.env file)

Update your `.env` file to use Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/referral-system
```

### Test Locally First

```bash
npm run dev
```

Make sure it connects successfully!

### Deploy to Render

Use the same Atlas connection string in Render's environment variables.

---

## 📝 Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0 FREE)
- [ ] Created database user (saved password!)
- [ ] Configured Network Access (0.0.0.0/0)
- [ ] Got Atlas connection string
- [ ] Updated local `.env` file
- [ ] Tested connection locally (`npm run dev`)
- [ ] Exported data from local MongoDB (optional)
- [ ] Imported data to Atlas (optional)
- [ ] Ready to deploy to Render!

---

## 🆘 Troubleshooting

### "MongoServerError: Authentication failed"

**Solution:**

- Check username and password are correct
- Make sure you're using the database user you created (not your Atlas account)

### "MongoNetworkError: failed to connect"

**Solution:**

- Check Network Access allows 0.0.0.0/0
- Wait a few minutes after changing Network Access settings

### "Database name doesn't match"

**Solution:**

- Make sure you're using the same database name in the connection string
- Your collection names will be the same, just different database location

---

## 💡 Benefits of MongoDB Atlas

✅ **Free forever** (M0 tier)
✅ **Managed by MongoDB** (no server management)
✅ **Automatic backups**
✅ **Scalable** (can upgrade later)
✅ **Works with Render** (cloud-to-cloud)
✅ **Accessible from anywhere**

---

## 🎉 You're Ready!

After completing these steps, you can:

1. Use your Atlas connection string locally
2. Deploy to Render with the same connection string
3. Keep your data in the cloud

**Next Step:** Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to deploy to Render!
