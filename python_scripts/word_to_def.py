from nltk.corpus import words
import requests
import json
import sys

ud_url = 'http://api.urbandictionary.com/v0/define?term='
rl_url = 'https://api.datamuse.com/words?ml='

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

if __name__ == '__main__':
	sentence = str(sys.argv[1])
	query(sentence)
