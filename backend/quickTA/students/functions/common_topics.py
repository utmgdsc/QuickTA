# from wordcloud import WordCloud, STOPWORDS
import yake
from datetime import datetime

def generate_wordcloud(data):
    
    # Join all sentences together
    text = " ".join(sentence for sentence in data)

    # Parameter specification
    numOfKeywords = 10

    kw_extractor = yake.KeywordExtractor(top=numOfKeywords)
    keywords = kw_extractor.extract_keywords(text)
    
    return keywords

