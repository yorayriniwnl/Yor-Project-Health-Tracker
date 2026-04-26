# Project Health Score Logic

The score is calculated out of 100 using six weighted dimensions:

| Dimension | Points |
|---|---:|
| Budget performance | 25 |
| Timeline performance | 25 |
| Physical progress | 20 |
| Contractor track record | 15 |
| Maintenance sustainability | 10 |
| Broker/compliance risk | 5 |

## Classification

- `HEALTHY`: 80 to 100
- `WATCHLIST`: 60 to 79
- `CRITICAL`: below 60

## Business rules

- Budget remaining = budget allocated - budget spent
- Budget usage percentage = budget spent / budget allocated * 100
- Time elapsed percentage = days since start / expected duration days * 100
- Delay days = current date - expected completion date when incomplete and overdue
- Contractor success rate = total delivered / past handled * 100
- Maintenance percentage = annual maintenance cost / budget allocated * 100
- Final score = budget score + timeline score + progress score + contractor score + maintenance score + broker score

Implementation: `backend/src/common/utils/health-score.ts`.
