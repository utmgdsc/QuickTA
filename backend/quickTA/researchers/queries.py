from datetime import datetime 

def daily_interactions_query_pipeline(course_id, start_date, end_date):

    return [
        { "$match": { "course_id": course_id, "start_time": {"$gte":start_date, "$lte": end_date} } },
        { "$project": { "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$start_time" } } } },
        { "$group": { "_id": "$date", "count": {"$sum": 1} } },
        { "$project": { "day": "$_id", "count": 1, "_id": 0 } },  
        { "$sort": { "day": 1 } }
    ]