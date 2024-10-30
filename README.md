
NSF Awards Search
========================

## Introduction

This is an Awards Search Application for the National Science Foundation that uses Next.js as the frontend and Flask as the API backend. 


## Backend

The Python/Flask server is hosted in the `/api` folder.

On localhost, the Flask server will be running at `127.0.0.1:5328`.

In production, the Flask server is hosted at [NSF.pythonanywhere.com](https://nsf.pythonanywhere.com/search_award_title?title=coffee).

## Frontend
The frontend is hosted at [NSF-Award-Search.vercel.app](https://nsf-award-search.vercel.app/)

It is built with React / Typescript and is styled using TailwindCSS. The home page of the app is located at `/app/page.tsx`



## Developing Locally

You can clone & create this repo with the following command

```bash
git clone https://github.com/Tenacs/NSF-Award-Search.git
```

## Getting Started

First, Set Up a Virtual Environment (venv):

```bash
python -m venv venv
```
Activate the virtual environment:

- macOS/Linux:

  ```bash
  source venv/bin/activate
  ```

- Windows:

  ```bash
  venv\Scripts\activate
  ```

Install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/) - learn about Flask features and API.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
