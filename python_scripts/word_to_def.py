'''
Python script to translate a given text into non-slang text.
There are multiple query functions defined in this file.
Each query was an interation of our idea on what would be the
best way to translate a given set of text. We ended up just 
going for more of a simple, hacky solution that translated
a given set of text from English to Japanese, and back. 
'''

from nltk.corpus import words
import requests
import json
import sys
import spacy
import sys
from bs4 import BeautifulSoup
from googletrans import Translator

#url links to ping for urbandictionary, reverse dictionary look-up, and dictionary.com
ud_url = 'http://api.urbandictionary.com/v0/define?term='
rl_url = 'https://api.datamuse.com/words?ml='
dict_url = 'https://www.dictionary.com/e/slang/'


def predict(text):
    '''
    Method: return detected slang in a given text block
    Input: given text block - string
    Return: list of slang words detected
    '''
    nlp = spacy.load("./python_scripts/model")
    doc = nlp(text)
    return [ent.text.lower() for ent in doc.ents]

def reverse_definition(definition):
    '''
    Method: query words from reverese definition look-up
    Input: a definition of a word - string 
    Return: 3 plausible words to fit the definition - string 
    '''
    new_url = rl_url+definition
    data = requests.get(new_url).json()
    new_word = ""
    for syn in data[:2]:
        new_word += syn['word']+'/'
    new_word = new_word[:-1]
    return new_word

def query(sentence):
    '''
    Method: translate sentence and replace slang with nonslang words
    Input: sentence to be translated - string 
    Return: translated sentence - string
    '''
    sent_list = sentence.split()
    for i, word in enumerate(sent_list):
        word = word.lower()

        #check if words are not in nltk.words()
        if not word in words.words():
            #ping urbandictionary for definition
            new_url = ud_url+word
            data = requests.get(new_url).json()
            if not data['list']:
                continue
            definition = data['list'][0]['definition']
            example = data['list'][0]['example']

            #reverse search on the definition
            definition = definition.replace("[","").replace("]","").split("\n")[0].replace(" ", "+")
            new_url = rl_url+definition
            data = requests.get(new_url).json()
            new_word = ""
            for syn in data[:3]:
                new_word += syn['word']+'/'
            new_word = new_word[:-1]

            #replace word with new nonslang word
            sent_list[i] = new_word

    #rebuiid and output translated sentence to stdout
    new_sentence = " ".join(str(x) for x in sent_list)
    print(new_sentence)

def query2(sentence):
    '''
    Method: translate sentence and replace slang with nonslang words
        checks if word exists in dictionary.com/e/slang first
    Input: sentence to be translated - string 
    Return: translated sentence - string
    '''
    sent_list = sentence.split()
    slang_words = predict(sentence)
    for i, word in enumerate(sent_list):

        #check if words are not in nltk.words() or if is slang
        if word in slang_words or not word in words.words():
            foundDefn = False
            try:
                #ping dictionary.com/e/slang for slang definition
                new_url = dict_url + word
                html = requests.get(new_url).text
                parsed_html = BeautifulSoup(html, 'html.parser')
                definition = list(filter(None, parsed_html.body.find('div', attrs={'class':'article-word__header__content__holder'}).text.strip().split('\n')))
                if definition[0] == 'RELATED WORDS':
                    for d in definition[1:]:
                        if d[0] != '\t':
                            definition = d
                            break
                new_word = reverse_definition(definition)
                sent_list[i] = new_word
                foundDefn = True
            except:
                pass

            #also ping urbandictionary for definitions
            new_url = ud_url+word
            data = requests.get(new_url).json()
            if not data['list']:
                continue
            definition = data['list'][0]['definition']
            example = data['list'][0]['example']

            #reverse search on the definition
            definition = definition.replace("[","").replace("]","").split("\n")[0].replace(" ", "+")
            new_word = reverse_definition(definition)
            
            #replace word with new nonslang word
            if foundDefn:
                sent_list[i] = sent_list[i] + "/" + new_word
            else:
                sent_list[i] = new_word

    #rebuiid and output translated sentence to stdout
    new_sentence = " ".join(str(x) for x in sent_list)
    print(new_sentence, flush=True)


def query3(sentence):
    '''
    Method: translate sentence and replace slang with nonslang words
        translate from Englishg to Japanese to English
    Input: sentence to be translated - string 
    Return: translated sentence - string
    '''
    translator = Translator()
    sentence = translator.translate(sentence, dest="ja").text
    sentence = translator.translate(sentence).text
    print(sentence)


if __name__ == '__main__':
    sentence = str(sys.argv[1])
    #query(sentence)
    #query2(sentence)
    query3(sentence)

