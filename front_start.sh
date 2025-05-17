#!/bin/bash

# Exit on any error
set -e

# --- Frontend setup ---
echo "🖼️  Setting up Frontend..."
cd ./front

echo "📦 Installing Frontend dependencies..."
pnpm install

echo "🎯 Starting Frontend dev server..."
pnpm run dev