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
  - When user sends chat, store it in DB
  - Invoke edge function with whole meeting data
  - Edge function takes needed data and constructs prompt
  - Calls AI api
  - Responds with result
  - Result is stored into DB locally