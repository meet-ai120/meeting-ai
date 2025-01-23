## TODO

- Fix google signin
- Do not show back button on homepage
- Back button position in windows
- Adjustable width, slider in mail section of shadcn
- Fix logout, currently you have to be on the home page 
- Apply rate limit to prevent abuse, create profile table and store limits for users

- discuss data flow


## Day 1
- Create a UI



## Data flow
- Note flow
  - Update note locally
  - To enhance call edge function, it should take note and ehance it via api, then update DB with new note
  - Live data should update note locally

- Chat flow
  - Send chat via edge function
  - Edge function updates DB with new message
  - AI api is called based on new message
  - Result from api is updated in DB
  - Live data is updated in chat locally