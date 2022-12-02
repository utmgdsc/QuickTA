const date = require('@js-temporal/polyfill');

const dateToCourseParser = () => {
    const now = date.Temporal.Now.plainDateISO().toString();
    const year = parseInt(now.substring(0, 5));
    const month = parseInt(now.substring(5, 7));
    const day = parseInt(now.substring(9, 11));

    if(month < 5){
        return `${year-1}W`
    }else if(month === 5){
        if(day > 7){
            return `${year-1}W`
        }return `${year-1}S`
    }else if(month <= 8){
        return `${year-1}S`
    }else{
        return `${year}F`
    }
}

export default dateToCourseParser;