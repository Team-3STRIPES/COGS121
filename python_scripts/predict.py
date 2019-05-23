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