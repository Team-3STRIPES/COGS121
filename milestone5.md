# Team Name: 3STRIPES

## Team Members
Edward Chen, Eunice Chan, Nathaniel Qin, and Sumeet Bansal

## UI Progress
### Home Page
Insert screenshot & explanation

### Profile Page
Insert screenshot & explanation

### Study Page
Insert screenshot & explanation

### Test Page
Insert screenshot & explanation

### Data Visualization
Our Firestore data is visualized in our Study Flash Cards and Test Yourself functionalities, pictured below in that order:
<img src="milestone_images/m5-dataviz-flashcards.png">
<img src="milestone_images/m5-dataviz-multiplechoice.png">

Since our app is intended to be educational, flashcards and multiple-choice questions align with our purpose and provide easily understood formats for students/users to educate themselves. All data displayed in the flashcards and multiple-choice questions come from Firestore, where we have [`question-set`](https://firestore.googleapis.com/v1/projects/cogs121-c88c5/databases/(default)/documents/question_set/) and [`flashcards`](https://firestore.googleapis.com/v1/projects/cogs121-c88c5/databases/(default)/documents/flashcards/) collections.

We implemented our data displays using AJAX requests to retrieve data, some additional JavaScript to parse the data from its Firebase format, and vanilla HTML/CSS to display the flashcards and test questions. We did not use any libraries/frameworks for the data display.

## Ambitious Data Visualization
Future releases would prioritize user-specific features, e.g. a history of translations and statistics such as commonly-translated words (for the user and regionally/globally). The translation history could be a simple two-column table with original inputs and then translations, which we could fold into our current AJAX request every time a translation is made, and the user statistics could be implemented using some more complex Firebase queries and a data visualization library such as [D3.js](https://d3js.org/).

## Purpose of "Translangtor"
The purpose of our slang translator would aid non-millenials in understanding current slang that they may be unfamiliar with. 
For example: Janine, while relaxing at home, noticed her son tweeted the word "lit" on Twitter as she was scrolling through social media. 
Janine doesn't know what "lit" means. Concerned that he might be using profanity that she's unaware of, Janine grabs her laptop 
and searches for the "Translangtor". She logs into her account through Google and types in "lit" into the translator. After a couple seconds, 
the words "amazing; spectacular; very good" display on Janine's screen. Relieved that her adolescent son isn't using profanity on Twitter, 
Janine closes her laptop and continues to go about her day. 
