# Merite Money

A Node.js application that enables team members to recognize and reward each other's contributions through a virtual coin-based recognition system, integrated with Discord for real-time notifications.

## Description

Merite Money is a web application built with Node.js that facilitates peer-to-peer recognition in organizations. Team members can send virtual coins to their coworkers as a token of appreciation for their help, support, or outstanding contributions. The system maintains a transparent leaderboard and integrates with Discord to celebrate these recognitions in real-time.

## Key Features

- 🪙 Peer-to-Peer Recognition System
  - Users can send virtual coins to colleagues
  - Each transaction requires a meaningful reason for recognition
  - Real-time balance tracking for all users

- 🏆 Dynamic Leaderboard
  - Track top contributors and most appreciated team members
  - Historical data analysis of coin distributions
  - Regular leaderboard updates and statistics

- 🤖 Discord Integration
  - Real-time notifications when coins are sent
  - Automatic mentions of both sender and receiver
  - Celebratory messages with coin amount and reason

- 👥 User Management
  - Secure authentication system based on JWT Token
  - User profiles with transaction history

## Features

- Web-based interface for managing merit points
- Optional Discord bot integration
- MongoDB database for data persistence
- RESTful API endpoints
- Authentication and authorization
- Configurable settings

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB
- Discord Bot Token (if using Discord integration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nima-abdpoor/Merite-Money.git
cd Merite-Money
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
# Database Configuration
MONGODB_URI=your_mongodb_uri

# Discord Configuration (if using Discord integration)
DISCORD_TOKEN=your_discord_bot_token

# Server Configuration
PORT=3000
```

## Configuration

The application uses the `config` package for managing different environments. Configuration files can be found in the `config/` directory.

### Discord Bot Setup

1. Create a Discord application and bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add the bot to your server with proper permissions
3. Configure the bot token in your `.env` file:
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_channel_id  # Channel where notifications will be sent
```

### Database Schema

The application uses MongoDB with the following main collections:

```javascript
// User Schema
{
  username: String,
  email: String,
  coinBalance: Number,
  transactionHistory: [{
    type: String,  // 'SENT' or 'RECEIVED'
    amount: Number,
    counterparty: ObjectId,
    reason: String,
    timestamp: Date
  }]
}

// Transaction Schema
{
  sender: ObjectId,
  receiver: ObjectId,
  amount: Number,
  reason: String,
  timestamp: Date
}
```

## Usage

### Sending Coins

Users can send coins through the web interface or using Discord commands:

```bash
# Web API Example
POST /api/transactions
{
  "receiverId": "user123",
  "amount": 5,
  "reason": "Thanks for helping with code review!"
}

# Discord Command Example
!send @user 5 Thanks for helping with code review!
```

### Viewing Leaderboard

Access the leaderboard through the web interface or Discord:

```bash
# Web API
GET /api/leaderboard

# Discord Command
!leaderboard
```

To start the server:

```bash
npm start
```

For development:

```bash
node Main.js
```

## Project Structure

```
├── config/         # Configuration files
├── controller/     # Route controllers
│   ├── AuthController.js      # Authentication logic
│   ├── TransactionController.js # Coin transaction handling
│   └── LeaderboardController.js # Leaderboard calculations
├── db/            # Database initialization and configuration
├── model/         # Database models
│   ├── User.js    # User model with coin balance
│   └── Transaction.js # Coin transaction model
├── server/        # Server setup and configuration
├── service/       # Business logic and services
│   ├── CoinService.js     # Coin transaction logic
│   ├── discord/           # Discord bot integration
│   └── LeaderboardService.js # Leaderboard calculations
├── util/          # Utility functions
├── views/         # View templates
└── Main.js        # Application entry point
```

## Testing

Run tests using:

```bash
npm test
```

## Dependencies

Major dependencies include:
- Koa - Web framework
- MongoDB/Mongoose - Database and ODM
- Discord.js - Discord bot integration
- JWT - Authentication
- And more (see package.json for complete list)

## License

This project is licensed under the ISC License.

## Author

nima abdpoor

---

For more information or support, please open an issue in the repository.
