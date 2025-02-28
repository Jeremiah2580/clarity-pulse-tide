# PulseTide
A decentralized app for monitoring live events and providing real-time audience feedback on the Stacks blockchain.

## Features
- Create live events with descriptions and metadata
- Allow users to provide feedback/reactions in real-time
- Track audience engagement metrics
- View historical event data

## Setup and Installation
1. Clone the repository
2. Install Clarinet
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to execute test suite

## Usage Examples
```clarity
;; Create a new event
(contract-call? .pulse-tide create-event "Concert XYZ" "Live music event" u1683900000)

;; Submit feedback for an event
(contract-call? .pulse-tide submit-feedback u1 "POSITIVE" "Great show!")

;; Get event details
(contract-call? .pulse-tide get-event-details u1)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
