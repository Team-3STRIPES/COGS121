from gtts import gTTS
import sys

def tts(sentence):
	sentence = sentence.strip()
	filename = './audio/' + sentence + '.mp3'
	tts = gTTS(sentence)
	tts.save(filename)
	print(sentence+'.mp3')


if __name__ == '__main__':
	sentence = str(sys.argv[1])
	tts(sentence)
