'''
Python script to save a string to an mp3 file for audio features.
Outputs the filename to stdout.
'''

from gtts import gTTS
import sys


def tts(sentence):
    #Clean sentence of extra white space
    sentence = sentence.strip()
    filename = './audio/' + sentence + '.mp3'

    #Save the sentence as an mp3 file using google-text-to-speech
    tts = gTTS(sentence)
    tts.save(filename)

    #Output filename to stdout
    print(sentence+'.mp3')


if __name__ == '__main__':
    sentence = str(sys.argv[1])
    tts(sentence)
