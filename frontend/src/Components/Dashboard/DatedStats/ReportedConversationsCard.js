import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";

const ReportedConversationCard = ({courseID}) => {
    const [numReport, setNumReport] = useState(null);

    /**
     * Get the reported conversations
     */
    const getReportedConversations = async () => {
        await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/researchers/reported-conversations?filter=${"All"}&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => { setNumReport(res.data.total_reported); })
        .catch((err) => { console.log(err); });
    }

    /**
     * Download the CSV file for the reported conversations
     */
    const downloadReportedConversations = async () => {
        if (courseID) {
            axios
                .get(process.env.REACT_APP_API_URL + `/researchers/reported-conversations-csv?filter=${"All"}&course_id=${courseID}&timezone=America/Toronto`)
                .then((res) => {
                    if (res.headers["content-disposition"]) {
                    fileDownload(
                        res.data,
                        res.headers["content-disposition"].split('"')[1]
                    );
                    }
                })
                .catch((err) => { console.log(err); });
        }
    }

    useEffect(() => { 
        getReportedConversations(); 
    }, [courseID]);

    return (<StatCard
        callBack={downloadReportedConversations}
        title={"Reported Conversations"}
        downloadable={true}
        label={numReport ? numReport : "-"}
        helpText={"number of conversations reported by students"}
      />);
}

export default ReportedConversationCard;