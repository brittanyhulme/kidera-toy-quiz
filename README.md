# Kidera Toy Quiz

A personalised toy recommendation quiz for kidera.com.au, built by Brittany Hulme (Paediatric OT).

## What this is
A self-contained React app. It matches toys to a child's age, interests, development goals and play style, then shows personalised recommendations with affiliate links, images, a swap button, and a feedback form that saves to Formspree.

This is the "Option B" build: all personalisation runs locally in the browser. No API key or backend needed.

---

## How to put it live (about 15 minutes, no coding)

### Step 1: Create a GitHub account and repository
1. Go to github.com and sign up (free) if you don't have an account.
2. Click the "+" top right, then "New repository".
3. Name it `kidera-toy-quiz`. Leave it Public. Click "Create repository".
4. On the next page click "uploading an existing file".
5. Drag in EVERYTHING from this folder EXCEPT the `node_modules` and `dist` folders (you don't need those, they're rebuilt automatically). The files you need are: index.html, package.json, vite.config.js, README.md, .gitignore, and the whole `src` folder.
6. Click "Commit changes".

### Step 2: Deploy on Vercel
1. Go to vercel.com and sign up with your GitHub account (free).
2. Click "Add New..." then "Project".
3. Find your `kidera-toy-quiz` repo and click "Import".
4. Leave all the settings as they are (Vercel detects Vite automatically).
5. Click "Deploy". Wait about a minute.
6. You'll get a live URL like `kidera-toy-quiz.vercel.app`. Copy it.

### Step 3: Embed in Squarespace
1. Open the Squarespace page where you want the quiz.
2. Add a "Code Block".
3. Paste this, swapping in your real Vercel URL:

```html
<iframe
  src="https://YOUR-QUIZ-URL.vercel.app"
  width="100%"
  height="900"
  style="border:none; max-width:680px; margin:0 auto; display:block;"
  title="Kidera Toy Quiz">
</iframe>
```

4. Save. Done.

---

## After it's live

- **Test the feedback form.** Do one test submission. Formspree will email you to confirm the form the first time. Click that link once to activate it permanently.
- **Check the images load.** They run through an image proxy so they should show. If any look broken, the quiz shows a tidy placeholder instead.
- **Affiliate links** use your tag brittanyot0c-22 and open in a new tab.

## Want to change something later?
Edit the file in `src/KideraToyQuiz.jsx` on GitHub (you can edit directly in the browser). Vercel rebuilds and redeploys automatically every time you save a change on GitHub.

## To run it on your own computer (optional, for testing)
You need Node.js installed. Then in this folder run:
```
npm install
npm run dev
```
It opens at localhost:5173.
