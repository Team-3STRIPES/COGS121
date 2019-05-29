import spacy
import sys

def predict(text):
    nlp = spacy.load("./python_scripts/model")
    doc = nlp(text)
    print("+".join([ent.text.lower() for ent in doc.ents]))

if __name__ == '__main__':
	sentence = str(sys.argv[1])
	predict(sentence)


