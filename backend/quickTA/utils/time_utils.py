from datetime import *

def convert_start_end_date(start_date, end_date):
    
    start_year = int(start_date.split("-")[0])
    start_month = int(start_date.split("-")[1])
    start_day = int(start_date.split("-")[2])   

    end_year = int(end_date.split("-")[0])
    end_month = int(end_date.split("-")[1])
    end_day = int(end_date.split("-")[2])

    start_date = datetime(start_year, start_month, start_day)
    end_date = datetime(end_year, end_month, end_day)
    
    return start_date, end_date