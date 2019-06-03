'''
Python script used to detect slang in a given input text block.
The script uses a pre-trained spaCy (an open-source software library
for advanced Natural Language Processing) model, to detect slang
in the given text. For any words that are in the text block that
also do not appear in the nltk.corpus words dataset will be counted
as slang. The script outputs the result to stdout. 
'''

import spacy
import sys
from nltk.corpus import words


def predict(text):
    '''
    Method: output a string containing slang words deliminated by "+"
    Input: text - string
    '''
    nlp = spacy.load("./python_scripts/model")
    doc = nlp(text)

    #Detect slang words
    slang_words = [ent.text.lower() for ent in doc.ents]

    #Find any words that aren't in the English language
    for word in text:
        if word not in words.words() and word not in slang_words:
            slang_words.append(word)

    #Output string deliminted by "+"
    print("+".join(slang_words))


if __name__ == '__main__':
    sentence = str(sys.argv[1])
    predict(sentence)
