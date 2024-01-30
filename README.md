# BBQ -Cheers!

Imagine we are going to host twice a year a BBQ with its active customers. The selection of customers is based on the industry type (insurances, tech, etc).

This repo implements a single page application that allows it to view its active and inactive customers. It is also be possible to create new customers, edit customers, delete inactive customers and filter customers by industry.

The customer initial data is a json hosted here but in order to enable all API methods, this repo is using a `json-server` resource that offer the main http requests we use for the features described above.

You can also see the complete "roadmap" with all features mapped and the planned progress for the next iterations on Projects tab.

---

Table of Contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-staterd)
- [About the project](#about-the-project)
- [Available scripts](#available-scripts)
- [Available endpoints](#available-endpoits)

## <a name='prerequisites'></a> Prerequisites

- Node = 18.x
- NPM >= 9.x
- Git

### Node version

To successfully run the project, you'll need to ensure you have Node.js version 16.x installed. If you currently have a different Node.js version installed on your local system, you can make use of nvm (Node Version Manager) to temporarily install the required Node.js version specifically for this project.

## <a name='getting-staterd'></a> Getting started

1. Clone the project repository by runnning `git clone git@github.com:joseliacosta/bbq-cheers.git`
2. Install the dependencies `npm install`

## <a name='about-the-project'></a> About the project

- This project was bootstrapped with [create-next-app](https://nextjs.org/docs/pages/api-reference/create-next-app)

- [JSON server](https://github.com/typicode/json-server) will give you a fake but realistic REST API using the static src/server/db.json file created after running npm install. If you make POST, PUT, PATCH or DELETE requests, changes will be automatically saved to db.json.
  > :bulb: I have chosen this `json-server`` approach because the provided link was going to enable the project only to GET requests and we want to access more features.

### Project stack

- React
- Next
- Typescript
- Tests with React Testing Libraries
- React hook forms
- React Query

### Project structure

```
── src
│   ├── app
│   │   ├── components
│   │   ├── context
│   │   ├── page.tsx
│   │   ├── pages
│   │   ├── services
│   │   │   ├── api
│   │   │   ├── mutations
│   │   │   └── queries
│   │   └── types
│   │
│   └── server
│
└── tsconfig.json

```

```
components # small components that can be reused.
context # Context used in the app.
page.tsx # main page
services/
    api: # Http requests
    mutations: # react-query mutation methods
    queries: # react-query query methods
types: # models
server # The fake API mentioned above.
```

## <a name='available-scripts'></a> Available scripts

In the project directory you can run

`npm run dev`

Runs the app in the development mode.
Open `http://localhost:3000` to view it in the browser.

`npm run server`
JSON server will run in watch mode on port 4002 - `http://localhost:4002`

`npm run test`
Lauches the test runner

`npm run seed-db`
Resets db.json to the original data (db.base.json).

## <a name='available-endpoits'></a> Available endpoints

- `GET http://localhost:4002/companies`: get the full list of companies
- `GET http://localhost:4002/companies/{id}`: get the company with id `{id}`
- `PATCH http://localhost:4002/companies/{id}`: update the company with id `{id}`
- `DELETE http://localhost:4002/companies/{id}`: delete the inactive company with id `{id}`
