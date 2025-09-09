# Landing Page Project (`lp`)

This repository contains multiple landing page projects used for BayEight / Genronkai campaigns.  
It is not only documentation, but also a **full tutorial** that will explain you Git, Vercel, HTML/CSS/JS, terminal commands, and developer workflows — all in one place.  
By reading this README, even beginners would be able to use CUI confidently.

---

## ⚡ 1. Terminal Basics
```🔹 Navigation
pwd     # print working directory
ls      # list files
cd dir  # change directory
```

```🔹 File viewing
cat file.txt   # show full file
less file.txt  # scrollable view (q = quit, /search = search)
head file.txt  # first 10 lines
tail file.txt  # last 10 lines
```

```🔹 Editing
code file.txt
```

```🔹 Autocomplete & history
Tab → auto-completes file/folder names.
↑ / ↓ (arrow keys) → scroll through command history.
Ctrl + R → search history interactively.
```

## 📥 2. Clone the Repository

First, install [Git](https://git-scm.com/downloads) if you don’t have one yet.  
Then clone this repository:

```bash
git clone https://github.com/ryota-genronkai/genronkai-lp001.git
cd lp
```
---

## 📚 3. What Are These Tools?
🔹 Git
Git is a version control system. It lets you track changes in your code, go back in history, and collaborate with others.
GitHub is a cloud service that stores your Git repositories.

🔹 Vercel
Vercel　is a cloud platform that automatically deploys your website when you push changes to GitHub.
Push → Deploy → Your LP is live instantly.

🔹 HTML
HTML = HyperText Markup Language. It defines the structure of your web page.

🔹 CSS
CSS = Cascading Style Sheets. It controls the design (colours, fonts, layout).

🔹 JavaScript
JS adds interactivity (e.g., button clicks, animations).

---

## 📂 4. Project Structure

The structure of the project looks like this:

```tree
.
├── bayeight
│   ├── lp20250826a
│   │   ├── images
│   │   │   ├── apply.gif
│   │   │   ├── emotion.webp
│   │   │   ├── ...
│   │   ├── index.html
│   │   ├── lp20250826
│   │   │   ├── index.html
│   │   │   └── style.css
│   │   ├── main.js
│   │   ├── style.css
│   │   └── thanks.html
│   └── lp20250826f
│       ├── images
│       │   ├── ...
│       ├── index.html
│       ├── main.js
│       ├── style.css
│       └── thanks.html
├── package.json
└── vercel.json
```
---

## 🔧 5. Installing Homebrew (macOS only)

Homebrew
 is a package manager for macOS. It makes installing tools easy.

Install Homebrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Check installation:
```
brew --version
```

Example usage:
```
brew install tree        # show directory structure
brew install imagemagick # image manipulation
brew install webp        # convert images to .webp
```
## ✏️ 6. Editing Files

Typical files you will edit:
　index.html → Main landing page HTML.
　style.css → CSS styling.
　main.js → JavaScript.
　thanks.html → Thank-you page.
　images/ → Optimized images.

To open and edit a file:
```
code index.html       # VS Code <- highly recommended
nano index.html       # simple terminal editor
open index.html       # open in browser
```

## 🖼️ 7. Converting Images to WebP

```Convert PNG → WebP:
mogrify -format webp *.png
```

## 🌳 8. Git Basics
```Check status:
git status
```

```Add files:
git add .
```

```Commit:
git commit -m "Updated hero image and fixed CSS"
```

```Push:
git push origin main
```

```Pull:
git pull origin main
```

## 🔄 9. Typical Workflow

```1. Clone once:
git clone https://github.com/ryota-genronkai/genronkai-lp001.git
cd lp
```
2. Edit files.
3. git status
4. git add .
5. git commit -m "msg"
6. git push origin main
7. Vercel deploys automatically.

## 🆕 10. Creating a New Landing Page (LP)

```Create new LP by copying an existing one:
cd bayeight
cp -r lp20250826a lp20250901
```

Edit files in lp20250901 (HTML, CSS, JS, images).
```Optimize images:
cd lp20250901/images
mogrify -format webp *.png
```

```Commit & push:
git add .
git commit -m "Created new LP lp20250901"
git push origin main
```

## 📊 11. Useful File Operations

```Replace characters in file:
sed -i 's/,/、/g' index.html
```

```Delete .log files:
find . -name "*.log" -exec rm {} \;
```

```Count lines:
wc -l *.html
```

```Search in files:
grep "form" index.html
```

```Merge files:
cat part1.txt part2.txt > merged.txt
```

```Find large files:
find . -type f -size +10M
```

## 🚀 12. Deployment with Vercel

Once you push to GitHub, Vercel automatically deploys.
Manual deploy:

vercel

## 📚 13. Cheat Sheet
```Command	Purpose
git status	Show changes
git add .	Stage all changes
git commit -m "msg"	Save changes
git push origin main	Upload to GitHub
git pull origin main	Get updates
tree	Show folder structure
sed -i 's/A/B/g' file	Replace text
mogrify -format webp *.png	Convert PNG → WebP
wc -l file	Count lines
grep "word" file	Search
find . -name "*.log" -exec rm {} \;	Delete logs
cat file	Show file content
less file	Scroll file
code file	Edit file
```
