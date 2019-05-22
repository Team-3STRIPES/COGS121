import spacy
import sys

def predict(text):
    nlp = spacy.load("./model")
    doc = nlp(text)
    return (str(["" + str(ent.text) + "_" + str(ent.label_) for ent in doc.ents]))

