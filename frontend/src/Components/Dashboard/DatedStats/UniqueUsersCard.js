import React, { useState, useEffect} from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";

const UniqueUsersCard = ({ courseID }) => {
  const [data, setData] = useState({
    unique_users: 0,
    total_users: 0,
    unique_users_percentage: 0,
  });  
  const isWeekly = "Weekly";

  /**
   * Download the CSV file for the unique users
   */
  const DownloadUniqueUsers = () => {
      if (courseID && isWeekly != null) {
          axios
            .post(
              process.env.REACT_APP_API_URL +
                `/researchers/feedback-csv?filter=${isWeekly}&course_id=${courseID}&timezone=America/Toronto`, {
                  course_id: courseID,
                }
            )
            .then((response) => {
              if (response.headers["content-disposition"]) {
                fileDownload(
                  response.data,
                  response.headers["content-disposition"].split('"')[1]
                );
              }
            })
            .catch((err) => { console.log(err); });
        }
      }

    /**
     * Get the unique users
     */
    const getUniqueUsers = async () => {
      axios.get(
        process.env.REACT_APP_API_URL +
        `/researchers/v2/unique-users?course_id=${courseID}&`
      )
      .then((res) => {
        if (res.data) {
          let data = res.data
          setData({
            unique_users: data.unique_users,
            total_users: data.total_users,
            unique_users_percentage: data.unique_users_percentage,
          });
        }
      })
      .catch((err) => { console.log(err); });
    }
      
    useEffect(() => {
      getUniqueUsers();
    }, []);

    return (
        <StatCard
            callBack={DownloadUniqueUsers}
            title={"Unique Users"}
            label={data.unique_users || "-"}
            downloadable={false}
            miniLabel={`/${data.total_users || "-"} (${data.unique_users_percentage || "-"}%)`}
            helpText={"registered users logged in"}
          />          
    );
}  

export default UniqueUsersCard;