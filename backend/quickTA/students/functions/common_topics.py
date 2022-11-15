from wordcloud import WordCloud, STOPWORDS
from datetime import datetime

def generate_wordcloud(data):
    
    # Join all sentences together
    text = " ".join(sentence for sentence in data)
    
    # List of words to ignore
    stopwords = set(STOPWORDS)
    # General terms
    stopwords.update([
        'says', 'know', 'will', 'stop', 'without', 
        'appear', 'us', 'think', 'help', 'may', 'want',
        'wondering', 'long', 'higher', 'noticed', 'small', 'sense',
        'probably', 'use', 'lot', "o'", 'task', 'run',
        'set', 'understand', 'unable', 'represents', 'affect',
        'works', 'actually', 'trouble', 'question', 'find', 'doesnt',
        'sure', 'others', 'title', 'even', 'going', 'causes',
        'okay', 'different', 'around', 'Edit', 'almost', 'fall',
        'fine', 'center', 'code', 'likely', 'helps', 'give', 'change',
        'likely', 'decide', 'part', 'understanding', 'pick', 'whole',
        'make', 'codes', 'many', 'avoid', 'possible', 'lab',
        'appreciated', 'appears', 'reading', 'confused', 'result',
        'return', 'Now', 'temporarily', 'times', 'changing',
        'Using'
    ])

    # niche terms
    stopwords.update([
        'function', 'data'
    ])
    # Create word cloud object
    wordcloud = WordCloud(stopwords=stopwords, background_color="white")
    
    # Generate and visualize the word cloud
    wc_img = wordcloud.generate(text)
    wc_img.to_file("img/wordcloud/wordcloud_{}.png".format(datetime.now()))
    # wc_img.to_svg("img/wordcloud/wordcloud_{}.svg".format(datetime.now()))
    