import { 
    Box, 
    FormControl,
    FormLabel,
    Switch,
    Heading, 
    Text, 
    Flex,
    Button,
} from "@chakra-ui/react"
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

    const cardStyle = {
        backgroundColor: 'white',
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
        borderRadius: '15px',
        padding: '5px 15px 15px 20px',
        maxWidth: '100%',
        overflowY: "auto"
      };
    
      const titleStyle = {
        fontSize: "20px",
        lineHeight: '25px'
      };

    // make api call to get the model id & models here
    const getAllModels = async () => {
      setLoadingModel(true);
      await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-get", {course_id: courseid})
        .then((res) => {
            setCurrentModel("null")
            setAllModels(res.data.gpt_models.map((obj) => {
              if(obj.status){
                setCurrentModel(obj.model_id);
              }
              return {model_name: obj.model_name, model_id: obj.model_id, status: obj.status}
            }));
            setLoadingModel(false);
        })
        .catch((err) => console.log(err))
    }

    useEffect(()=>{
      if (courseid){
        getAllModels();
      }
    },[courseid, processing]);

    return (
        <Box style={cardStyle} mt={5}>
            <Heading as='h2'><span style={titleStyle}>Model Information</span></Heading>
            <Flex>
                <Text><span style={{fontWeight: '500'}}>Current model:</span> {currentModel}</Text>
            </Flex>
            <Flex flexWrap="wrap" mt={3} marginLeft='-5px'>
                <ModelRemover deleting={processing} setDeleting={setProcessing} courseid={courseid}/>
                <ModelCreator creating={processing} setCreating={setProcessing} courseid={courseid}/>
            </Flex>
            <Flex flexDirection={"row"} flexWrap={"wrap"} py={5} gap={2}>
          {
            allModels.length !== 0 ?
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
            )
           ):  <>This course has no models!</>
          }
           </Flex>
        </Box>
    );
}

export default ModelBody;