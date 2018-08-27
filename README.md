# SFU Match

Usage Instructions:
1. Call "vagrant up"
2. Go to localhost:8080

# Description of SFU Match:

SFU Match is a "smart" dating website for SFU students revolving around the idea of allowing a heuristic algorithm
    to do the matching for you! Users can complete themed surveys (such as academics, sports, etc.) and SFU Match will
    return a computed list of users that have the highest compatibility rating. This is done dynamically based on our
    custom engineered algorithms.

Information sharing is through our "poke" feature. The idea is simple, if you want to know you have your eye on
    someone, just simply send them a poke! If they also feel the same way, they can poke you back and SFU Match will
    automatically share your contact details so that you and your match can meet up on your own terms.

# Technical Details:
-   Database: PostgresSql
-   Backend: Python Django Framework
-   FrontEnd: ExtJs
-   WebServer: Nginx
-   Application Server: UWSGI

# Core Functionality:

1. Compatibility Matching based on our custom algorithm
    - Will accurately match you based on your gender preferences of you and your potential matches
    - Calculates a heuristic percentage based on how you answered our surveys

2. User Profiles
    - Login for users
    - User Profile Pictures
    - Comments

3. Poke Feature
    - Poke users who you are interested/matched with
    - Sends a poke notification to the user to display on their landing page

4. Friends List
    - Quickly access your friends who you have been poke authenticated with

5. Events List
    - Have quick access to events that are happening around SFU

7. Restful APIs
    - Designed using a API first approach
    - All APIs follow the REST standard
    - Authorization and Authentication of APIs

# Demo Instructions:
1. Log in with these credentials: username: "mhnguyen@sfu.ca" password: "Password1"
    - This is an example of a user who has completed all 3 of our surveys, with active friends, etc.
    - Clicking (!) icon on the top right will display notifications.

2. Logout and create a new account with your own credentials
    - Will automatically log in and you can complete the introductory survey.

3. All API's are restful. For example http://localhost:8080/api/member/ will return a list of all members.
    - All endpoints are protected with authorization/authentication permissions. Some endpoints will return a subset
        of the data depending on if the user is authorized to access it

4. Note: Our ExtJs files are served over a CDN. So if the internet is slow; it will directly impact the performance
of the website until it is cached.

References:
FavIcon logo is based off of: http://designmodo.com/love-dating-logo-design/