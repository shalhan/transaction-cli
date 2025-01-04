#!/bin/bash

cleanup() {
  echo "Cleaning up before exit..."
  # Perform any necessary cleanup here
  npm run db:remove
}

npm run db:seed

trap 'cleanup; exit' SIGINT SIGTERM

npm run build
npm run start 

# Capture the PID of the background process
pid=$!

# Wait for the background process to finish
wait $pid

# Capture the exit status of the Node.js application
exit_status=$?

# Check the exit status
if [ $exit_status -eq 0 ]; then
  echo "Node.js application exited successfully with status 0."
else
  echo "Node.js application exited with status $exit_status."
fi

