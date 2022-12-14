from wordcloud import WordCloud, STOPWORDS
import yake
import matplotlib

def generate_wordcloud(data):
    
    # Join all sentences together
    text = "\n".join(sentence for sentence in data)

    # Parameter specification
    numOfKeywords = 25
    max_ngram_size = 3
    

    kw_extractor = yake.KeywordExtractor(top=numOfKeywords, n=max_ngram_size)
    keywords = kw_extractor.extract_keywords(text)
    return keywords

def get_wordcloud_image(data):
    _keywords = generate_wordcloud(data)
    keywords = {}
    for keyword in _keywords:
        keywords[keyword[0]] = 1 - keyword[1]
    
    print(keywords)

    wordcloud = WordCloud(background_color='white')
    wordcloud.generate_from_frequencies(keywords)

    img = wordcloud.to_image()
    return img


