'''
Python script to save a string to an mp3 file for audio features.
Outputs the filename to stdout.
'''

from gtts import gTTS
import sys


def tts(sentence):
	filename = './audio/'+sentence + '.mp3'
	tts = gTTS(sentence)
	tts.save(filename)
	print(sentence+'.mp3')


if __name__ == '__main__':
	sentence = str(sys.argv[1])
	tts(sentence)