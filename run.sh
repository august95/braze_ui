#!/bin/bash

# Start backend server
node src/backend/server.js &
SERVER_PID=$!

# Start frontend dev server
#npm run dev
node node_modules/vite/bin/vite.js

kill $SERVER_PID
