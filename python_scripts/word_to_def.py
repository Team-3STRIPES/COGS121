from nltk.corpus import words
import requests
import json
import sys
import spacy
import sys
from bs4 import BeautifulSoup
from googletrans import Translator

ud_url = 'http://api.urbandictionary.com/v0/define?term='
rl_url = 'https://api.datamuse.com/words?ml='
dict_url = 'https://www.dictionary.com/e/slang/'

def predict(text):
    nlp = spacy.load("./python_scripts/model")
    doc = nlp(text)
    return [ent.text.lower() for ent in doc.ents]

def reverse_definition(definition):
	new_url = rl_url+definition
	data = requests.get(new_url).json()
	new_word = ""
	for syn in data[:2]:
		new_word += syn['word']+'/'
	new_word = new_word[:-1]
	return new_word

def query(sentence):
	sent_list = sentence.split()
	for i, word in enumerate(sent_list):
		word = word.lower()
		if not word in words.words():
			new_url = ud_url+word
			data = requests.get(new_url).json()
			if not data['list']:
				continue
			definition = data['list'][0]['definition']
			example = data['list'][0]['example']

			definition = definition.replace("[","").replace("]","").split("\n")[0].replace(" ", "+")
			new_url = rl_url+definition
			data = requests.get(new_url).json()
			new_word = ""
			for syn in data[:3]:
				new_word += syn['word']+'/'
			new_word = new_word[:-1]
			sent_list[i] = new_word

	new_sentence = " ".join(str(x) for x in sent_list)
	print(new_sentence)

def query2(sentence):
	#print(sentence)
	sent_list = sentence.split()
	slang_words = predict(sentence)
	#print(slang_words)
	for i, word in enumerate(sent_list):
		if word in slang_words or not word in words.words():
			foundDefn = False
			try:
				new_url = dict_url + word
				html = requests.get(new_url).text
				parsed_html = BeautifulSoup(html, 'html.parser')
				definition = list(filter(None, parsed_html.body.find('div', attrs={'class':'article-word__header__content__holder'}).text.strip().split('\n')))
				if definition[0] == 'RELATED WORDS':
					for d in definition[1:]:
						if d[0] != '\t':
							definition = d
							break
				#print("1. "+definition)
				new_word = reverse_definition(definition)
				sent_list[i] = new_word
				foundDefn = True
			except:
				pass

			new_url = ud_url+word
			data = requests.get(new_url).json()
			if not data['list']:
				continue
			definition = data['list'][0]['definition']
			example = data['list'][0]['example']

			definition = definition.replace("[","").replace("]","").split("\n")[0].replace(" ", "+")
			#print("2. "+definition)

			new_word = reverse_definition(definition)
			if foundDefn:
				sent_list[i] = sent_list[i] + "/" + new_word
			else:
				sent_list[i] = new_word

	new_sentence = " ".join(str(x) for x in sent_list)
	print(new_sentence, flush=True)


def query3(sentence):
	translator = Translator()
	sentence = translator.translate(sentence, dest="zh-tw").text
	sentence = translator.translate(sentence).text
	print(sentence)


if __name__ == '__main__':
	sentence = str(sys.argv[1])
	#query(sentence)
	#query2(sentence)
	query3(sentence)

#article-word__header__content__holder