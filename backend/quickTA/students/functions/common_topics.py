from wordcloud import WordCloud, STOPWORDS
import yake
from datetime import datetime

def generate_wordcloud(data):
    
    # Join all sentences together
    text = "\n".join(sentence for sentence in data)

    # Parameter specification
    numOfKeywords = 25
    max_ngram_size = 3
    

    kw_extractor = yake.KeywordExtractor(top=numOfKeywords, n=max_ngram_size)
    keywords = kw_extractor.extract_keywords(text)
    print(keywords)
    
    return keywords

def get_wordcloud_image(data):

