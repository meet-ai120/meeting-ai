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
  - To enhance call edge function it should take note, transcript and chat from DB and enhance it via api then return result
  - This result should be updated in supabase

- Chat flow
  - Send chat via edge function
  - Edge function updates DB with new message
  - AI api is called based on new message
  - Result from api is updated in DB
  - Live data is updated in chat locally