# Team Name: 3STRIPES

## Team Members
* <b>Edward Chen</b>: Headed all of the slang translation algorithm (all of the python scripts), created backend routes, and set up database.<br>
* <b>Eunice Chan</b>: Helped design user interface, helped code pages in HTML, CSS, JS, and took charge of branding and logo design.<br>
* <b>Nathaniel Qin</b>: Headed the linking of front-end pages to Firebase and Firestore, helped code pages in HTML, CSS, and JS, and helped design user interface.<br>
* <b>Sumeet Bansal</b>: Helped refactor code and set up database.<br>

## Source Code Files
### Python
<ul>
<li><b>python_scripts/detect_slang.py</b> &mdash; Python script used to detect slang in a given input text block. The script uses a pre-trained spaCy (an open-source software library for advanced Natural Language Processing) model, to detect slang in the given text. For any words that are in the text block that also do not appear in the nltk.corpus words dataset will be counted as slang. The script outputs the result to stdout.</li>
<li><b>python_scripts/edit.py</b> &mdash; Python script to clean up tweets collected from Twitter, essentially replacing fancy quotes and ellipsis with single quotes ' or double quotes ".</li>
<li><b>python_scripts/get_twitter_data.py</b> &mdash; Python script to parse and gather tweets from the Twitter firehose. This scripts logs in with a users Twitter development credentials and parses the Twitter tweet stream, searching for tweets with corresponding key words.</li>
<li><b>python_scripts/predict.py</b> &mdash; Python script used to detect slang in a given input text block. This script isn't very different from detect_slang.py but was mainly used as just a tester for the trained model.</li>
<li><b>python_scripts/train.py</b> &mdash; Python script used to train a spaCy model from a json file. spaCy is an open-source software library for advanced Natural Language Processing, written in the programming languages Python and Cython. This script has two functions, one function converts the json file from dataturks (a website used to annotate text and other mediums for machine learning) formating to a formating used by spaCy. The second function trains the model from the data.</li>
<li><b>python_scripts/tts.py</b> &mdash; Python script to save a string to an mp3 file for audio features. Outputs the filename to stdout.</li>
<li><b>python_scripts/webscrape.py</b> &mdash; Python script used to scrape dictionary.com for slang words, acrynonyms,  definitions, and examples. The words, acrynonyms, and definitions were later saved into a json format and added into our Firestore database. The examples were transformed into the dataturks formatting and used to add more data to our model.</li>
<li><b>python_scripts/word_to_def.py</b> &mdash; Python script to translate a given text into non-slang text. There are multiple query functions defined in this file. Each query was an interation of our idea on what would be the best way to translate a given set of text. We ended up just going for more of a simple, hacky solution that translated a given set of text from English to Japanese, and back.</li>
</ul>

### HTML
<ul>
<li><b>static_files/html/home.html</b> &mdash; HTML source code for our home page. Home page includes login functionalities as well as the main function of our application; translangtion. </li>
<li><b>static_files/html/profile.html</b> &mdash; HTML source code for our profile page. Profile page includes information about the user like their name, and also provides navigation to studying and testing functionalities.</li>
<li><b>static_files/html/study.html</b> &mdash; HTML source for our flash card studying page. This page includes flash cards for all of the words the user has seen before.</li>
<li><b>static_files/html/test.html</b> &mdash; HTML source code for our testing page. This page includes 10 short questions to quiz the user.</li>
</ul>

### CSS
<ul>
<li><b>static_files/css/home.css</b> &mdash; CSS stylesheet for home.html.</li>
<li><b>static_files/css/profile.css</b> &mdash; CSS stylesheet for profile.html.</li>
<li><b>static_files/css/study.css</b> &mdash; CSS stylesheet for study.html.</li>
<li><b>static_files/css/test.css</b> &mdash; CSS stylesheet for test.html.</li>
</ul>

### JS
<ul>
<li><b>server.js</b> &mdash; This file contains all of the scripts necessary for linking the front-end pages to the back-end routes. Uses Express.js.</li>
<li><b>static_files/js/auth.js</b> &mdash; This file contains all of the scripts necessary for authentication. Our web application uses Firebase for authentication, which is connected to Google. Users can use our web application using their Google account. They can also translate words without logging in.</li>
<li><b>static_files/js/auth.jshome.js</b> &mdash; This file contains all of the scripts that are necessary for the home page. Various things such as button click event handlers are contained within here, as well as more complex things like calling the back end scripts for translations and updating information the database.</li>
<li><b>static_files/js/auth.jsprofile.js</b> &mdash; This file contains all of the scripts necessary for the profile page. Some functionalities include various button click handlers. This also pings the database to retrieve information about the user, such as their word count, their level, and their translation history.</li>
<li><b>static_files/js/auth.jsstudy.js</b> &mdash; This file contains all of the scripts necessary for the flash cards studying page. The database is first pinged for all of the words that the user has seen before. Then, the flash cards are populated into an object (flashCards). There are also button click event handlers for navigating between the cards.</li>
<li><b>static_files/js/auth.jstest.js</b> &mdash; This file contains all of the scripts necessary for the testing page. There are various, simple button event handlers. Most of the functionalities in here are for retrieving questions from the database, and for making sure the quiz is randomized each time.</li>
<li><b>js_scripts/import.js</b>< &mdash; Javascript script to easily import a json file into Google Firestore and to censor any profanity found in any of the definitions.</li>
</ul>

## Google Slide Presentation
<a href="https://docs.google.com/presentation/d/1FLko5TKmta40VUbRjMvWWSMNCHMel5xP01CJPoORVjk/edit?usp=sharing">Click me for the Google Slide!</a><br>

## Final Video Demo
<a href="https://www.youtube.com/watch?v=VK4VvmrPVRo">Click me to see the video!</a><br>
