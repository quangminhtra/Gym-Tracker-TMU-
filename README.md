# Implement Gym Facility Tracker

This is a code bundle for Implement Gym Facility Tracker. [Here is the original project](https://www.figma.com/design/VpZuKIFLetB8iOgEpcB7R9/Implement-Gym-Facility-Tracker)

# Gym-Tracker-TMU-

## Requirements

Please ensure the following are installed:
- git
- node
- npm

## Instalation

Next clone the project using

``` bash
git clone https://github.com/quangminhtra/Gym-Tracker-TMU-.git
cd Gym-Tracker-TMU-
```

Then ensure the project dependencies are installed using

``` bash
npm i
```

This will mainly install React, Vite, Firebase SDK and Supabase SDK -- core components of this project.

Next, create a new `.env` file

```bash
touch .env
```

and edit it using the following format

```bash
VITE_SUPABASE_URL= {some-url}
VITE_SUPABASE_ANON_KEY={some-private-key}
FIREBASE_TOKEN={some-private-key}
```
The keys are found in the google docs shared by Minh.

> [!IMPORTANT]
> Ensure that the `.env` file is in the root directory **of your project**
> Hence `~/Gym-Tracker-TMU-`

## Running the code locally

To start the development server run

```bash
npm run dev
```

and then open the the project using your browser at

```
http://localhost:5173
```

# Contributing

Ensure that you have been invited as a collaborator on this project.

Make your own branch using 

```bash
git branch -m branch-name
git checkout branch-name
```

Push your committed changes using

```bash
git push origin branch-name
```

Lastly to merge with `main`, submit a **Pull Request** using Github.
