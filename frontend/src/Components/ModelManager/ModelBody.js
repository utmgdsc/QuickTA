import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  Heading,
  Text,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import ModelCreator from "./ModelCreator";
import { useEffect, useState } from "react";
import ModelCard from "./ModelCard";
import axios from "axios";
import CustomSpinner from "../CustomSpinner";
import ModelRemover from "./ModelRemover";

const ModelBody = ({ courseid, setLoadingModel, loadingModel }) => {
  const [currentModel, setCurrentModel] = useState("");
  const [allModels, setAllModels] = useState([{}]);
  const [processing, setProcessing] = useState(false);
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "5px 15px 15px 20px",
    maxWidth: "100%",
    overflowY: "auto",
  };

  const titleStyle = {
    fontSize: "20px",
    lineHeight: "25px",
  };

  // make api call to get the model id & models here
  const getAllModels = async () => {
    setLoadingModel(true);
    // console.log("Current course id:", courseid);
    let params = "course_id=" + courseid;
    await axios
      .get(process.env.REACT_APP_API_URL + `/models/gpt/course?${params}`)
      .then((res) => {
        let data = res.data;
        setAllModels(data.models);
        setLoadingModel(false);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  useEffect(() => {
    if (courseid) {
      getAllModels();
    }
  }, [courseid, processing, currentModel]);

  return (
    <>
      <Box style={cardStyle} mt={5}>
        <Heading as="h2">
          <span style={titleStyle}>Model Information</span>
        </Heading>
        {/* <Flex>
          <Text>
            <span style={{ fontWeight: "500" }}>Current model:</span>{" "}
            {currentModel}
          </Text>
        </Flex> */}
        <Flex flexWrap="wrap" mt={3} marginLeft="-5px">
          <ModelRemover
            deleting={processing}
            setCurrentModel={setCurrentModel}
            setDeleting={setProcessing}
            courseid={courseid}
            allModels={allModels}
          />
          <ModelCreator
            creating={processing}
            setCreating={setProcessing}
            courseid={courseid}
          />
        </Flex>
        <Flex flexDirection={"row"} flexWrap={"wrap"} py={5} gap={2}>
          {allModels.length !== 0 ? (
            allModels.map((obj, key) => (
              <div key={key}>
                <ModelCard
                  setCurrentModel={setCurrentModel}
                  courseid={courseid}
                  modelId={obj.model_id}
                  modelName={obj.model_name}
                  modelStatus={obj.status}
                  colorScheme={obj.status ? "green" : "gray"}
                  enabling={processing}
                  setEnabling={setProcessing}
                />
              </div>
            ))
          ) : (
            <>This course has no models!</>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default ModelBody;
