# import the necessary packages
from PIL import Image
import pytesseract
print(pytesseract.image_to_string(Image.open('test_image.png')))