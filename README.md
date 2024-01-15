# TabberTrack

This is the source code for the website [tabbertrack.com](https://tabbertrack.com).

TabberTrack is "The all in one solution for managing how much money you and your friends owe eachother." I created this website to learn the ins-and-outs of developing and deploying a complete full-stack web application. The website is, for the most part, completely production ready and I encourage you to try it out and even use it in the real world if the app appeals to you.

## Getting started

Go to [tabbertrack.com](https://tabbertrack.com) and signup! It's that easy!

With that said: if you would like to setup a development environment, click [here](#setup-a-development-environment).

## What did I use?

The "stack" I chose was:

-   [Next.js](https://nextjs.org/) and by extension, [React](https://react.dev/)
-   [Postgresql](https://www.postgresql.org/)
-   [Prisma](https://www.prisma.io/)
-   [Tailwind CSS](https://tailwindcss.com/)

Other notable packages were:

-   [NextAuth.js](https://next-auth.js.org/)
-   [Postmark](https://postmarkapp.com/)
-   [shadcn/ui](https://ui.shadcn.com/)

The website is hosted on [Vercel](https://vercel.com/) and uses [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) for production.

## Setup a development environment

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/)
-   [Postgresql](https://www.postgresql.org/download/)
-   A verified [Postmark](https://postmarkapp.com/) account
-   A [Google Cloud API](https://cloud.google.com/apis) "Client ID for Web application"

### Installation

1. Clone the repository:

```bash
git clone https://github.com/timothyhilton/tabbertrack
```

2. Fill in all of the environment variables:

```bash
cp .env.example .env
```

Use your text editor of choice to edit the .env file

3. Let npm install everything:

```bash
npm install
```

4. Migrate the database:

```bash
npx prisma db push
```

Open http://localhost:3000 with your browser to see the result.
