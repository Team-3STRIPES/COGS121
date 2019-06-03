'''
Python script used to detect slang in a given input text block.
This script isn't very different from detect_slang.py but was
mainly used as just a tester for the trained model. 
'''

import spacy
import sys

def predict(text):
    nlp = spacy.load("./model")
    doc = nlp(text)
    print("Predicting:")
    print(str(["" + str(ent.text) + "_" + str(ent.label_) for ent in doc.ents]))

if __name__ == '__main__':
	sentence = str(sys.argv[1])
	predict(sentence)