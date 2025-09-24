#!/bin/bash

# Start backend server
node src/backend/server.js &
SERVER_PID=$!

# Start frontend dev server
npm run dev

kill $SERVER_PID
