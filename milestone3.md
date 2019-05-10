# Team Name: 3STRIPES

## Team Members
Edward Chen, Eunice Chan, Nathaniel Qin, and Sumeet Bansal

## Backend
For our data layer, we chose to use Firestore to minimize required set up for developing or deploying the app, since a more traditional database solution (e.g. PostgreSQL, MongoDB) would need to be installed and configured on everyone's machines, whereas Firestore can be easily accessed by all. Additionally, we decided a NoSQL solution would better suit many of our proposed features (e.g. user history).

We make use of the Urban Dictionary API to pull definitions for slang words and phrases, and then put those definitions through a second API that returns single words that're most relevant to the multi-word definitions inputted, allowing us to concisely translate.
