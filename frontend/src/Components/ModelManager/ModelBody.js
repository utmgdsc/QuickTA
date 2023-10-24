import {
  Box,
  Heading,
  Flex,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import ModelCreator from "./ModelCreator";
import { useEffect, useState } from "react";
import ModelCard from "./ModelCard";
import axios from "axios";
import ModelRemover from "./ModelRemover";
import { Tooltip, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Grid, Chip, CircularProgress, TableContainer} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { CheckIcon, CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import { ClearIcon } from "@mui/x-date-pickers";

const ModelBody = ({ courseid, setLoadingModel, loadingModel }) => {
  const modelTemplate = {
    model_name: "",
    model_id: "",
    model: "",
    prompt: "",
    max_tokens: 0,
    top_p: 0.0,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    status: false,
    deployment: {
      deployment_name: "",
      deployment_id: "",
      deployment_url: "",
      deployment_token: "",
    },
  }
  const [currentModel, setCurrentModel] = useState(modelTemplate);
  const [allModels, setAllModels] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState(false);
  const [createModel, setCreateModel] = useState(false);

  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "5px",
    padding: "5px 15px 15px 20px",
    maxWidth: "100%",
    overflowY: "auto",
    margin: "10px"
  };

  const titleStyle = {
    fontSize: "20px",
    lineHeight: "25px",
  };

  // make api call to get the model id & models here
  const getAllModels = async () => {
    setLoadingModel(true);
    await axios
      .get(process.env.REACT_APP_API_URL + `/models/gpt/course`, {
        params: {
          course_id: courseid,
        }
      })
      .then((res) => {
        let data = res.data;
        setAllModels(data.models.map((obj) => { return {...obj, selected: false }}));
        setLoadingModel(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditModel = (index) => {
    var _allModels = [...allModels];
    var originalState = _allModels[index].selected 
    _allModels.map((obj) => { obj.selected = false; })
    _allModels[index].selected = !originalState;

    if (_allModels[index].selected) {
      setSelectedModel(_allModels[index]);
    } else {
      setSelectedModel(false);
    }
    
    setAllModels(_allModels);
    setCurrentModel(_allModels[index]);
  }
  
  const handleCopyModel = (index) => {
    let srcModel = {...allModels[index]};
    var _allModels = [...allModels, srcModel];
    _allModels[_allModels.length - 1].copy = "T";
    _allModels[_allModels.length - 1].model_id = "********-****";
    _allModels[_allModels.length - 1].model_name += " copy";
    setAllModels(_allModels);
    setCurrentModel(_allModels[_allModels.length - 1]);
  }

  const handleDeleteModel = (index) => {

    
    let model_id = allModels[index].model_id;
    var _allModels = [...allModels];
    _allModels.splice(index, 1);
    setAllModels(_allModels);
    
    // Copied model
    if (model_id === "********-****") { return; }

    axios.delete(process.env.REACT_APP_API_URL + `/models/gpt`, {
      params: {
        model_id: model_id
      }
    })
    .then((res) => { console.log(res); })
    .catch((err) => { console.log(err); });
  }

  const createNewModel = () => {
    var _allModels = [...allModels];
    _allModels.map((obj) => { obj.selected = false; }) 
    setAllModels(_allModels);
    setCreateModel(true);
    setSelectedModel(false);
    setCurrentModel(modelTemplate);
  }

  useEffect(() => {
    if (courseid ) { getAllModels(); }
  }, [courseid]);

  return (
    <Grid container mt={2}>
      {!createModel && <Grid xs={12} md={selectedModel ? 6 : 12}>
        <Box style={cardStyle} className="">
          <Box className="d-flex align-items-center">
            <Heading className="my-3" size={"lg"} style={{ fontWeight: 700 }}>
              Course Models
            </Heading>
            <Spacer />
            <Box className="green-button" onClick={createNewModel}>
              Create new model
            </Box>
          </Box>
          <TableContainer style={{ maxHeight: "90vh", overflow: "auto"}}>
            <Table style={{ 
              borderCollapse: "separate",
              borderSpacing: "0 1px",
              width: "100%",
            }}>
              <TableHead>
                <TableRow className="border-top">
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>Deployment</TableCell>
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>Model Name</TableCell>
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>Model ID</TableCell>
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600, minWidth: "130px"}}>LLM Used</TableCell>
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600, minWidth: "130px", textAlign: "center"}}>Model Status</TableCell>
                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600, minWidth: "150px"}}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingModel
                  ? <TableRow className="border-top">
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  : allModels.length === 0 ?
                    <TableRow className="border-top">
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        No models found.
                      </TableCell>
                    </TableRow>
                  : allModels.map((obj, index) => (
                    <TableRow key={index} className={
                      obj.selected 
                        ? "models-active-row" 
                        : "" 
                      + obj.copy === "T"
                        ? "models-copy-row"
                        : ""
                      + " reported-conversation-tr border-top border-bottom"} 
                      style={{ cursor: "default" }}
                    >
                      <TableCell> {obj.deployment ? obj.deployment.deployment_name : ""}</TableCell>
                      <TableCell>{obj.model_name}</TableCell>
                      <TableCell>{obj.model_id ? obj.model_id.slice(0, 8) + "-****" : "" }</TableCell>
                      <TableCell>{obj.model}</TableCell>
                      <TableCell
                        style={{ textAlign: 'center' }}>
                        <Chip 
                          style={obj.status 
                                  ? { backgroundColor: "green", color: "white" } 
                                  : { backgroundColor: "#F1F1F1", color: "black" }}
                          label={obj.status ? "Active" : "Inactive"}
                        />
                      </TableCell>
                      <TableCell>
                        {obj.delete === "T" ?
                        <Box>
                          <Tooltip title="Confirm">
                            <IconButton size="small" onClick={() => {handleDeleteModel(index)}} >
                              <CheckIcon color="green.500" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton size="small" onClick={() => {
                              var _allModels = [...allModels];
                              _allModels[index].delete = "F";
                              setAllModels(_allModels);
                            }} >
                              <ClearIcon style={{ color: "red" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        : <Box>
                            <Tooltip title="Edit Model">
                              <IconButton size="small" onClick={() => {handleEditModel(index)}} >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy Model">
                              <IconButton size="small" onClick={() => {handleCopyModel(index)}} >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Model">
                              <IconButton size="small" onClick={() => {
                                var _allModels = [...allModels];
                                _allModels[index].delete = "T";
                                setAllModels(_allModels);
                              }} >
                                <DeleteIcon color="red.500" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      </TableCell>

                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid> }

      { (selectedModel || createModel) &&
        <Grid xs={12} md={createModel ? 12 : 6}>
          <Box style={{ ...cardStyle, width: "100%" }}>
            <ModelCard
              courseid={courseid}
              currentModel={currentModel}
              setCurrentModel={setCurrentModel}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              createModel={createModel}
              setCreateModel={setCreateModel}
              getAllModels={getAllModels}
              allModels={allModels}
              setAllModels={setAllModels}
              // modelId={selectedObj.model_id}
              // modelStatus={selectedObj.status}
              // modelName={selectedObj.model_name}
              // colorScheme={obj.status ? "green" : "gray"}
              enabling={processing}
              setEnabling={setProcessing}
            />
          </Box>
        </Grid>
      }
    </Grid>
  );
};

export default ModelBody;
