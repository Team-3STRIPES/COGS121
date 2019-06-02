import spacy
import sys
from nltk.corpus import words


def predict(text):
    nlp = spacy.load("./python_scripts/model")
    doc = nlp(text)
    slang_words = [ent.text.lower() for ent in doc.ents]
    for word in text:
    	if word not in words.words() and word not in slang_words:
    		slang_words.append(word)
    print("+".join(slang_words))

if __name__ == '__main__':
	sentence = str(sys.argv[1])
	predict(sentence)


