# 🔄 Repository Setup Guide

**Created:** December 15, 2024  
**Status:** ✅ Complete - Two repos configured

---

## 🎯 **Your Repository Strategy**

You now have **TWO repositories** set up:

### **1. Public Repo (Portfolio)** 📢
```
URL: https://github.com/rajkumar20197/AWS_Cloud_Project_Career-Copilot
Purpose: Portfolio & Job Applications
Visibility: PUBLIC
Share with: Recruiters, employers, anyone
```

**Contains:**
- ✅ Source code (clean, no secrets)
- ✅ Documentation
- ✅ Architecture guides
- ✅ Templates (.env.example)
- ❌ NO real credentials

### **2. Private Repo (Development)** 🔒
```
URL: https://github.com/rajkumar20197/Ai_Career_Agent_Coach_private
Purpose: Actual Development & Testing
Visibility: PRIVATE
Share with: Nobody (just you)
```

**Contains:**
- ✅ Everything from public repo
- ✅ Real AWS credentials (.env files)
- ✅ Test data
- ✅ Experiments
- ✅ Work in progress

---

## 📁 **Your Local Setup**

**Current Folder:**
```
E:\Level_up\AWS_Cloud_Project_Career-Copilot
```

**Git Remotes:**
```bash
origin  → Public repo (AWS_Cloud_Project_Career-Copilot)
private → Private repo (Ai_Career_Agent_Coach_private)
```

---

## 🔄 **Workflow: How to Use Both Repos**

### **Daily Development (Use Private Repo)**

```bash
# 1. Make changes to your code
# Edit files, add features, test with real AWS

# 2. Commit changes
git add .
git commit -m "Add new feature"

# 3. Push to PRIVATE repo
git push private master

# Your work is now safely backed up in private repo!
```

### **Update Portfolio (When Ready to Share)**

```bash
# 1. Make sure no credentials in code
# Remove any .env files, AWS keys, etc.

# 2. Commit clean code
git add src/ docs/
git commit -m "Update portfolio with new feature"

# 3. Push to PUBLIC repo
git push origin master

# Now recruiters can see your latest work!
```

---

## 🛡️ **Security Rules**

### **✅ Safe to Push to BOTH Repos:**
```
✅ src/**/*                    Source code
✅ docs/*.md                   Documentation
✅ public/**/*                 Public assets
✅ .env.example                Templates
✅ README.md                   Project info
✅ package.json                Dependencies
```

### **✅ Safe to Push to PRIVATE ONLY:**
```
✅ backend/.env                Real AWS credentials
✅ server/.env                 Real secrets
✅ .env                        Environment variables
✅ test-data/                  Test user data
✅ experiments/                Work in progress
```

### **❌ NEVER Push to PUBLIC:**
```
❌ backend/.env                Contains AWS keys!
❌ Any file with real credentials
❌ Real ARNs with account IDs
❌ API keys or secrets
❌ Test user data
```

---

## 📋 **Common Commands**

### **Check Which Remote You're Using:**
```bash
git remote -v
```

### **See Current Branch:**
```bash
git branch
```

### **Push to Specific Remote:**
```bash
git push origin master    # Push to public repo
git push private master   # Push to private repo
```

### **Push to Both (Careful!):**
```bash
# Only do this if NO credentials in code!
git push origin master
git push private master
```

### **Check What Will Be Committed:**
```bash
git status
git diff
```

### **Verify .env is Ignored:**
```bash
git check-ignore backend/.env
# Should output: backend/.env
```

---

## 🎯 **Recommended Workflow**

### **For New Features:**

1. **Develop in Private:**
   ```bash
   # Work on feature
   # Test with real AWS credentials
   git add .
   git commit -m "Add feature X"
   git push private master
   ```

2. **Clean for Public:**
   ```bash
   # Remove any credentials
   # Verify no secrets
   git add src/ docs/
   git commit -m "Add feature X (portfolio version)"
   git push origin master
   ```

### **For Documentation:**

```bash
# Documentation is safe for both
git add docs/
git commit -m "Update documentation"
git push origin master    # Public
git push private master   # Private
```

---

## 🔍 **Before Every Push - Checklist**

### **Pushing to PUBLIC repo:**
- [ ] No .env files with real values
- [ ] No AWS credentials
- [ ] No API keys
- [ ] No real ARNs
- [ ] Code is clean and documented
- [ ] Safe to share with recruiters

### **Pushing to PRIVATE repo:**
- [ ] Changes committed
- [ ] Tests passing (if applicable)
- [ ] Ready to back up

---

## 💡 **Pro Tips**

### **1. Use Branches:**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Work on feature"

# Push to private
git push private feature/new-feature

# When ready, merge to master
git checkout master
git merge feature/new-feature
```

### **2. Selective Commits:**
```bash
# Commit only specific files
git add src/components/NewComponent.tsx
git commit -m "Add new component"
git push origin master  # Safe for public
```

### **3. Check Before Push:**
```bash
# See what will be pushed
git diff origin/master

# Search for potential secrets
git diff | grep -i "AKIA"      # AWS keys
git diff | grep -i "sk_live"   # Stripe keys
```

---

## 🎓 **What This Shows Employers**

By maintaining two repos, you demonstrate:

✅ **Security awareness** - You understand credential management  
✅ **Professional workflow** - You use industry best practices  
✅ **Organization** - You separate concerns properly  
✅ **Attention to detail** - You're careful with sensitive data  

**This is MORE impressive than just having one repo!**

---

## 📊 **Current Status**

✅ **Public Repo:** Set up and shared  
✅ **Private Repo:** Set up and ready  
✅ **Local Folder:** Connected to both  
✅ **Git Remotes:** Configured correctly  
✅ **Security:** .gitignore protecting secrets  

**You're all set!** 🎉

---

## 🚀 **Next Steps**

Now that repos are set up:

1. **Continue development in this folder**
2. **Push to private repo** for backup
3. **Push to public repo** when ready to share
4. **Add real AWS credentials** to `.env` (safe now!)
5. **Continue with backend setup**

---

## 📞 **Quick Reference**

| Task | Command |
|------|---------|
| **Push to public** | `git push origin master` |
| **Push to private** | `git push private master` |
| **Check remotes** | `git remote -v` |
| **Check status** | `git status` |
| **Verify .env ignored** | `git check-ignore backend/.env` |

---

## 🆘 **Troubleshooting**

### **Problem: Accidentally pushed to wrong repo**
```bash
# Don't panic! Just push to correct repo
git push [correct-remote] master
```

### **Problem: Want to remove remote**
```bash
git remote remove private
```

### **Problem: Want to rename remote**
```bash
git remote rename private dev
```

---

**You now have a professional dual-repo setup!** 🎯

**Last Updated:** December 15, 2024  
**Status:** Ready for development ✅
