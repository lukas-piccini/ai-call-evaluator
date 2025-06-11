# AI Call Evaluator

This project is a simple re-creation of a design for a AI Call Evaluator Dashboard, where users can visualize a graph and a table with the recent calls and give feedback on each message.

You can visit the project at: [https://ai-call-evaluator.vercel.app](https://ai-call-evaluator.vercel.app).

## Stack

This project uses:
- React 19
- Tanstack Router
- Tanstack Table
- ReactQuery
- Zod
- React Hook Forms
- Tailwindcss
- Shadcn
- Motion
- Zustand
- Faker
- json-server

## Data format

For this project, I've used the [Retell](https://www.retellai.com) response api format.

## Requirements
- Node 18+

## Running the project

You can run the project locally by simply running those commands
```sh
git clone https://github.com/lukas-piccini/ai-call-evaluator.git
```

```sh
cd ai-call-evaluator
```

```sh
npm i
```

You will also need a `.env`. You can create it by running the following command
```sh
cp .env.example .env
```

And then simply run the project with
```sh
npm run dev
```


For displaying the data, I provided a simple API where it generates 100 random calls from real data using the Retell api format. You can run it by following the commands
```sh
git clone https://github.com/lukas-piccini/ai-call-evaluator-server.git
```

```sh
cd ai-call-evaluator-server
```

```sh
npm i
```

```sh
npm run start
```

## Considerations
- On my aggregator, I did every aggregation as a separate `reduce` call, just to make it simpler for the development tests, since I was using fake data. On a real product, this would come from an API so I wouldn't need to worry about aggregation, but I understand that I could do it as a unique reduce where it aggregates every call and returns the entire object.
- On the conversation, deppending on the size of it, it might be good to virtualize the conversation list, since it can get pretty big if the conversation is long.
- Needs testing, mainly integration tests and some e2e.
