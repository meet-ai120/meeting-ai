## TODO

- Can't record if headphone is connected after opening app
- Fix google signin
- Fix data storing, right now regularly invalidating queries. Make it so that meeting data is stored locally and only updates should be sent to DB. When error we can can refetch


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