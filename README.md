# Internet Government — Discord Bot + Website System

## 1. Project Overview

**Internet Government** is a persistent fictional government simulation built around a Discord server.

Every participating Discord member becomes a citizen. Citizens can participate in elections, propose and vote on laws, earn and spend fictional currency, hold government positions, interact with courts and agencies, and influence the evolving state of the fictional country.

The project is intentionally funny and chaotic, but underneath the game is a serious backend/infrastructure project.

The system is designed to teach and demonstrate:

- REST APIs
- PostgreSQL
- Database design
- Authentication and authorization
- Transactions and concurrency
- Discord bot development
- Background jobs
- Caching with Redis
- Web development
- Linux administration
- Docker
- Nginx / reverse proxies
- DNS and domains
- HTTPS/TLS
- Deployment
- Monitoring and logging
- AI API integration

## 2. High-Level Architecture

```text
                         INTERNET
                            |
                     Domain / DNS
                            |
                         Router
                            |
                    Raspberry Pi 5
                            |
                          Nginx
                     /       |       \\
                    /        |        \\
             Website       API      Discord Bot
               |             |           |
               +-------------+-----------+
                             |
                         PostgreSQL
                             |
                           Redis
                             |
                         AI Provider
```

The Raspberry Pi acts as the home server.

A possible domain setup:

```text
government.example.com
api.example.com
status.example.com
```

Nginx receives incoming HTTP/HTTPS requests and routes them to the appropriate application.

## 3. Raspberry Pi Server

A Raspberry Pi 5 can serve as the development and production-like home server.

Recommended starting hardware:

- Raspberry Pi 5
- 4GB or 8GB RAM
- Active cooling
- 27W USB-C power supply
- 128GB+ microSD card

Eventually:

- NVMe SSD
- Raspberry Pi M.2 adapter
- Larger backup storage

### Storage

The microSD card can initially contain:

```text
Linux
Application code
Docker
PostgreSQL
Discord bot
Nginx
Logs
Configuration
```

An NVMe SSD can later be used for:

```text
PostgreSQL data
Docker volumes
Redis persistence
Logs
Backups
Application data
```

The SSD is not strictly required at the beginning.

### RAM vs Storage

RAM is temporary working memory. Storage is persistent.

```text
RAM
├── Linux
├── Discord bot
├── API
├── PostgreSQL processes
├── Redis
└── Nginx

Storage
├── Operating system
├── Programs
├── Database files
├── Configuration
├── Logs
└── Backups
```

## 4. Core Components

### Discord Bot

The Discord bot is the primary interface for citizens.

Example commands:

```text
/register
/profile
/balance
/law propose
/law list
/law vote
/election
/vote
/court
/jobs
/business
/treasury
/news
/constitution
/stats
```

The bot communicates with the backend API and/or database.

### Backend API

The API is the central application layer.

Possible implementation:

- Go
- C# / ASP.NET Core
- PostgreSQL
- Redis

```text
Discord Bot
     |
     v
 REST API
     |
     +---- PostgreSQL
     |
     +---- Redis
     |
     +---- AI Provider
```

The API should contain the actual game rules rather than putting all game logic directly into Discord command handlers.

This allows multiple clients to use the same system:

```text
Discord Bot ----\\
                 \\
Website ----------> API ---> Database
                 /
Admin tools ----/
```

## 5. PostgreSQL Database

PostgreSQL stores persistent game state.

Potential tables:

```text
users
citizens
roles
parties
elections
candidates
votes
laws
law_votes
law_actions
constitution
government_positions
ministries
treasury
transactions
taxes
businesses
jobs
properties
court_cases
juries
charges
sentences
warrants
prison_records
foreign_countries
diplomatic_relations
news_articles
ai_memories
audit_logs
```

Not all tables need to exist initially. Start small and expand as features are implemented.

## 6. Citizen System

When a Discord user joins the game, they can register as a citizen.

Example citizen profile:

```text
Citizen:
    Discord ID
    Username
    Citizen ID
    Join date
    Reputation
    Money
    Job
    Government position
    Political party
    Region
    Properties
    Businesses
    Criminal record
```

The Discord ID should be the external identity used to associate a Discord account with a citizen.

## 7. Economy

The game uses fictional currency.

Example:

```text
Internet Dollars (ITD)
```

Citizens can:

- Earn wages
- Buy items
- Own businesses
- Pay taxes
- Receive government payments
- Pay fines
- Trade with other citizens
- Donate to organizations
- Buy property

The government has its own treasury.

Every important monetary change should create a transaction record.

```text
transaction:
    id
    sender
    receiver
    amount
    type
    timestamp
    reason
```

This creates an auditable economic history.

## 8. Government

The fictional government can have multiple branches.

### Executive

Possible positions:

```text
President
Vice President
Governor
Mayor
Cabinet members
Agency heads
```

### Legislature

Users can become representatives.

The legislature can:

- Propose laws
- Debate laws
- Vote on laws
- Modify laws
- Approve budgets
- Change taxes

### Judiciary

Users can participate as:

- Judges
- Lawyers
- Jurors

The judiciary can handle fictional violations of game laws.

## 9. Elections

Elections can be persistent game events.

```text
Election
    |
    +-- Position
    +-- Candidates
    +-- Start time
    +-- End time
    +-- Eligible voters
    +-- Votes
    +-- Result
```

Possible elections:

```text
President
Governor
Mayor
Representative
Judge
Party leadership
```

Voting should use database transactions and enforce eligibility rules. A user should not be able to vote multiple times for the same election.

## 10. Political Parties

Players can create fictional parties.

Example:

```text
Rat Party
Duck Party
Programmer Party
Stone Party
```

Parties can have:

- Name
- Description
- Leader
- Members
- Platform
- Treasury
- Headquarters
- Reputation

The parties are purely part of the fictional game world.

## 11. Law System

The law system should be **semi-open**.

Users should be able to write creative proposals, but the system should not execute arbitrary code submitted by users.

There is an important distinction:

```text
Writing a law
        !=
Executing arbitrary code
```

A proposal can contain free-form text.

Example:

```text
Title:
Anti-Frog Act

Description:
Anyone who owns a frog must pay 50 ITD every Tuesday.
```

However, enforcement should use a predefined action system.

## 12. Structured Law Actions

Possible supported actions:

```text
fine_user
give_money
remove_money
give_role
remove_role
mute_user
send_message
change_tax
restrict_command
grant_item
remove_item
```

A law could therefore become:

```text
Trigger:
User owns a frog

Action:
remove_money

Amount:
50 ITD

Frequency:
weekly
```

The backend understands these actions and executes them safely.

## 13. AI-Assisted Laws

AI can help translate creative law proposals into structured rules.

Example:

```text
User writes:

"Anyone who says skill issue should lose 50 dollars."
```

AI could produce something conceptually like:

```json
{
  "trigger": "message_contains",
  "value": "skill issue",
  "action": "remove_money",
  "amount": 50
}
```

The backend should then:

1. Validate the generated structure.
2. Verify that the trigger is supported.
3. Verify that the action is supported.
4. Verify that the parameters are valid.
5. Store the proposal.
6. Send it through the required voting process.
7. Activate it only if approved.

AI must not be allowed to generate and execute arbitrary backend code.

## 14. Law Lifecycle

A law could move through these states:

```text
DRAFT
  |
  v
PROPOSED
  |
  v
DEBATING
  |
  v
VOTING
  |
  +----> REJECTED
  |
  v
PASSED
  |
  v
ACTIVE
  |
  v
EXPIRED / REPEALED
```

This creates a clear audit trail.

## 15. Law Categories

Possible categories:

### Social Laws

Funny rules affecting citizens.

### Economic Laws

Taxes, wages, fines, businesses, and money.

### Government Laws

Rules governing government positions and procedures.

### Constitutional Laws

Fundamental rules of the fictional country.

Constitutional changes could require a higher voting threshold, such as 2/3. These numbers are game-design choices and can be changed later.

## 16. Courts

Citizens can bring fictional cases to court.

```text
Case #184

Plaintiff:
Citizen A

Defendant:
Citizen B

Charge:
Violation of Law #42

Judge:
Citizen C

Jury:
7 citizens

Status:
TRIAL
```

Possible outcomes:

```text
ACQUITTED
GUILTY
DISMISSED
```

Possible fictional penalties:

```text
Fine
Temporary role removal
Loss of reputation
Temporary command restriction
Jail
Community service
```

All penalties should be implemented using safe predefined actions.

## 17. Jail / Criminal System

A fictional criminal system can exist inside the game.

```text
Warrant
    |
    v
Arrest
    |
    v
Trial
    |
    +----> Acquitted
    |
    v
Conviction
    |
    v
Sentence
```

The system should keep an audit log of important actions.

## 18. Businesses and Jobs

Citizens can have jobs and businesses.

Example jobs:

```text
Software Developer
Police Officer
Judge
Teacher
Journalist
Politician
Shopkeeper
Farmer
Engineer
```

Businesses could generate revenue.

```text
Citizen
   |
   v
Business
   |
   +--> Employees
   +--> Revenue
   +--> Expenses
   +--> Taxes
```

This can turn the economy into a much deeper simulation.

## 19. Government Treasury

The government has its own bank account.

Revenue sources:

```text
Taxes
Fines
Fees
Business taxes
Property taxes
```

Expenses:

```text
Government salaries
Programs
Infrastructure
Grants
Emergency spending
```

Government actions involving money should create transaction records.

## 20. Redis

Redis can be introduced later.

Potential uses:

```text
Session data
Rate limiting
Temporary game state
Leaderboards
Caching
Cooldowns
Job queues
Distributed locks
```

For example:

```text
Discord command
      |
      v
Redis checks cooldown
      |
      +----> Too soon -> reject
      |
      v
API
```

Redis should not replace PostgreSQL as the source of truth for permanent game data.

## 21. Background Jobs

Some actions should happen automatically.

Examples:

```text
Daily taxes
Weekly elections
Salary payments
Law expiration
Business income
Scheduled news
Prison sentence completion
Database cleanup
Backups
```

A background worker can handle these.

```text
Scheduler
    |
    +--> Daily tax job
    +--> Salary job
    +--> News job
    +--> Law expiration job
    +--> Backup job
```

## 22. AI Newspaper

An AI-powered fictional newspaper can summarize events in the game.

```text
THE INTERNET TIMES

BREAKING:
Parliament passes the Frog Appreciation Act.

ECONOMY:
Internet Dollars reach a new all-time high.

CRIME:
Three citizens were arrested for attempting
to evade the government's banana tax.
```

The AI should receive structured game events rather than unrestricted database access.

```text
Game Events
     |
     v
News Generator
     |
     v
AI API
     |
     v
Generated Article
     |
     v
Database
```

## 23. AI Citizen Interaction

AI can also provide characters or government services.

Examples:

```text
AI government clerk
AI journalist
AI lawyer assistant
AI historian
AI bureaucrat
AI foreign diplomat
```

The application should control what information the AI is allowed to access.

## 24. Website

A website can provide a public government portal.

Possible pages:

```text
Home
Constitution
Laws
Parliament
Elections
Candidates
Government
Treasury
Economy
Court
Citizens
Businesses
News
Statistics
```

The website communicates with the same backend API as Discord.

## 25. Admin Dashboard

A private administration dashboard can help manage the system.

Possible features:

```text
View users
View transactions
View audit logs
Inspect laws
Manage elections
Inspect errors
View server health
Disable broken features
Manage AI usage
```

Administrative permissions must be separate from normal citizen permissions.

## 26. Authentication and Authorization

Discord identity can be used for the bot.

The website can eventually use Discord OAuth.

The system should distinguish between:

```text
Unauthenticated user
Citizen
Government official
Moderator
Administrator
System administrator
```

Authorization should happen on the backend. Do not trust the frontend to enforce permissions.

## 27. Security

Important security areas:

- Passwords should never be stored in plaintext.
- Secrets should be stored in environment variables or a secrets manager.
- Database credentials should not be committed to Git.
- API endpoints should validate input.
- Discord IDs should be treated as untrusted input.
- Users should not be able to execute arbitrary code.
- AI output should be validated before being used.
- Rate limiting should exist for public endpoints.
- Administrative endpoints require strong authorization.
- Database queries should use parameterized queries.
- Logs should avoid leaking secrets.

## 28. Docker

Eventually the Raspberry Pi can run the system using Docker.

```text
Docker
├── nginx
├── api
├── discord-bot
├── postgres
├── redis
├── worker
└── website
```

Docker Compose can manage the services.

## 29. Nginx

Nginx sits in front of web services.

```text
Internet
   |
   v
Nginx
   |
   +--> Website
   |
   +--> API
   |
   +--> Admin dashboard
```

It can handle HTTPS, reverse proxying, domain routing, static files, rate limiting, and request logging.

## 30. DNS and HTTPS

A registered domain points to the server's public IP.

```text
government.example.com
        |
        v
      DNS
        |
        v
    Public IP
        |
        v
   Home Router
        |
        v
 Raspberry Pi
```

The router forwards required ports to the Pi. If the public IP changes, a dynamic DNS solution may be needed.

The public website and API should use HTTPS. Nginx can terminate HTTPS and forward requests internally to applications.

## 31. Logging, Auditing, Monitoring, and Backups

Important actions should be recorded:

```text
User proposed law
User voted
Election opened
Election closed
Money transferred
Government official appointed
Law activated
Law repealed
Court case created
Administrative action performed
```

An audit log might contain:

```text
timestamp
actor
action
target
metadata
```

Monitor:

```text
CPU
RAM
Temperature
Disk usage
Network
Docker containers
API status
Database status
Redis status
Discord bot status
```

Backups should exist outside the Pi:

```text
PostgreSQL
    |
    +--> Local backup
    +--> External storage
    +--> Cloud backup
```

## 32. Suggested Technology Stack

```text
Hardware:
Raspberry Pi 5

OS:
Raspberry Pi OS / Debian Linux

Backend:
Go or C# / ASP.NET Core

Database:
PostgreSQL

Cache:
Redis

Bot:
Discord API

Web:
HTML/CSS/JavaScript or a frontend framework

Reverse Proxy:
Nginx

Containers:
Docker + Docker Compose

AI:
External AI API

Version Control:
Git + GitHub
```

## 33. Development Roadmap

### Phase 1 — Basic Bot

Build:

```text
/register
/profile
/balance
```

Create the database and basic citizen system.

### Phase 2 — Economy

Add money, transactions, jobs, and income.

### Phase 3 — Laws

Add law proposals, law voting, law activation, and law expiration.

Start with a small set of predefined actions.

### Phase 4 — Government

Add government positions, elections, parties, and parliament.

### Phase 5 — Courts

Add cases, judges, juries, charges, and sentences.

### Phase 6 — Website

Create the public government portal.

### Phase 7 — AI

Add AI newspaper, AI government assistants, AI law parsing, and AI citizen interactions.

### Phase 8 — Infrastructure

Move toward Docker, Nginx, HTTPS, a domain, Redis, background workers, monitoring, and backups.

## 34. Example User Experience

A new Discord member joins.

```text
User:
 /register
```

Bot:

```text
Welcome, Citizen #1842.

You have been granted:
100 ITD

Region:
New Texas

Reputation:
50
```

The user sees an election:

```text
Election:
President

Candidates:
- Bob
- The Frog
- Steve
```

They vote.

Later they propose:

```text
"The government should give everyone 10 ITD whenever it rains."
```

Parliament votes. If the law passes, a background job can apply its effects according to the game's rules.

The AI newspaper might report:

```text
THE INTERNET TIMES

RAIN MAKES CITIZENS RICHER

Parliament's latest economic experiment
has distributed 10 ITD to every citizen.
Economists are deeply concerned.
```

## 35. Most Important Architecture Principle

```text
Discord is an interface.
The website is an interface.
The API is the application.
PostgreSQL is the source of truth.
```

Do not put the entire game inside Discord command handlers.

Instead:

```text
Discord
   |
Website
   |
Admin tools
   |
   v
  API
   |
   +--> PostgreSQL
   +--> Redis
   +--> Workers
   +--> AI
```

## 36. Initial Minimal Version

The first version should contain only:

```text
Discord Bot
    |
    v
Backend API
    |
    v
PostgreSQL

Features:
- Register
- Profile
- Balance
- Transfer money
- Propose law
- Vote on law
- View laws
```

Once that works reliably, add elections, government positions, courts, businesses, AI, website functionality, Redis, Docker, Nginx, and the rest.

The goal is not to build everything immediately. Build a small working system, then continuously expand it.
