import {
  Box,
  FormLabel,
  Heading,
  Stack,
  Input,
  HStack,
  Divider,
  FormControl,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Grid, IconButton, InputLabel, MenuItem, Select, Switch, TextField, TextareaAutosize, Tooltip } from "@mui/material";
import { create } from "@mui/material/styles/createTransitions";
import { Form } from "react-router-dom";
import { ClearIcon } from "@mui/x-date-pickers";

const ModelCard = ({
  modelId,
  courseid,
  setCurrentModel,
  currentModel,
  selectedModel,
  setSelectedModel,
  createModel,
  setCreateModel,
  getAllModels,
  allModels,
  setAllModels
}) => {
  const defaultModelTemplate = {
    deployment_id: "",
    model_name: "",
    model: "",
    default_message: "",
    prompt: "",
    max_tokens: 0,
    top_p: 0.0,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    temperature: 0.0,
    status: true,
  }
  const [newModel, setNewModel] = useState(defaultModelTemplate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentList, setDeploymentList] = useState([]);

  const updateField = (field, value) => {
    setNewModel({ ...newModel, [field]: value,});
  }
  
  /**
   * Reset the new model to the default template
   */
  const resetNewModel = () => {
    setNewModel(defaultModelTemplate);
  };

  /**
   * Validates all model settings field
   * @param {Model object} obj Model settings to be validated
   * @returns true if all fields are valid, false otherwise
   */
  function isValid(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (["deployment_id", "model_name", "model", "prompt"].includes(key)) {
        if (value.length <= 0) { return false; }
        break;
      } else if (key === "max_tokens") {
        if (isNaN(parseInt(value)) || value < 0) { return false; }
      } else if (key === "status" && typeof value == "boolean") {
          break;
      } else {
        if (isNaN(parseFloat(value)) || value < 0) { return false; }
      } 
    }
    return true;
  }

  /**
   * Create a new model
   */
  const createNewModel = async () => {
    setIsSubmitting(true);
    await axios
      .post(process.env.REACT_APP_API_URL + `/models/gpt`, {
        course_id: courseid,
        deployment_id: newModel.deployment_id,
        model_name: newModel.model_name,
        model: newModel.model,
        model_description: newModel.model_description,
        default_message: newModel.default_message,
        prompt: newModel.prompt,
        max_tokens: newModel.max_tokens,
        top_p: newModel.top_p,
        presence_penalty: newModel.presence_penalty,
        frequency_penalty: newModel.frequency_penalty,
        temperature: newModel.temperature,
        status: newModel.status,
      })
      .then((res) => {
        setIsSubmitting(false);
        getAllModels();
        setCreateModel(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err);
      });
  };
  
  /**
   * Update the model settings
   */
  const updateModel = async () => {
    setIsSubmitting(true);
    let modelId = currentModel.model_id;
    await axios
      .patch(
        process.env.REACT_APP_API_URL + `/models/gpt?model_id=${modelId}`,
        {
          course_id: currentModel.course_id,
          deployment_id: currentModel.deployment_id,
          model_name: newModel.model_name,
          model: newModel.model,
          model_description: newModel.model_description,
          default_message: newModel.default_message,
          prompt: newModel.prompt,
          max_tokens: newModel.max_tokens,
          top_p: newModel.top_p,
          presence_penalty: newModel.presence_penalty,
          frequency_penalty: newModel.frequency_penalty,
          temperature: newModel.temperature,
          status: newModel.status,
        }
      )
      .then((res) => { 
        setIsSubmitting(false);
        
        // Update the model in allModels
        let _allModels = allModels;
        _allModels.map((model) => {
          if (model.model_id === currentModel.model_id) {
            model.model_name = newModel.model_name;
            model.model = newModel.model;
            model.model_description = newModel.model_description;
            model.default_message = newModel.default_message;
            model.prompt = newModel.prompt;
            model.max_tokens = newModel.max_tokens;
            model.top_p = newModel.top_p;
            model.presence_penalty = newModel.presence_penalty;
            model.frequency_penalty = newModel.frequency_penalty;
            model.temperature = newModel.temperature;
            model.status = newModel.status;
          }
        })
        setAllModels(_allModels);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err);
      });
  };

  /**
   * Enable the model
   */
  const enableModel = async () => {
    await axios
      .get( process.env.REACT_APP_API_URL + `/models/gpt/activate?course_id=${courseid}&model_id=${modelId}`)
      .then((res) => { setCurrentModel(modelId); })
      .catch((err) => { console.log(err); });
  };

  /**
   * Disable the model
   */
  const getModelSettings = () => {
    setNewModel({
      model_name: currentModel.model_name,
      model: currentModel.model,
      model_description: currentModel.model_description,
      default_message: currentModel.default_message,
      prompt: currentModel.prompt,
      max_tokens: currentModel.max_tokens,
      top_p: currentModel.top_p,
      presence_penalty: currentModel.presence_penalty,
      frequency_penalty: currentModel.frequency_penalty,
      temperature: currentModel.temperature,
      status: currentModel.status,
    });
  }

  /**
   * Get the course deployments
   */
  const getCourseDeployments = async () => {
    // const roles = await axios.get(process.env.REACT_APP_API_URL + `/course/deployments?course_id=${courseID}`)
    await axios.get(process.env.REACT_APP_API_URL + `/course/deployment?course_id=${courseid}`)
        .then((res) => {
            let data = res.data;
            setDeploymentList(data.deployments);
            setNewModel({ ...newModel, deployment_id: data.deployments[0].deployment_id });
        })
}
  /**
   * Handles the close event of the model card
   */
  const handleClose = () => {
    if (createModel) { setCreateModel(false); }
    // Find current model in allModels
    let _allModels = allModels;
    _allModels.map((model) => {
      if (model.model_id === currentModel.model_id) {
        model.selected = false;
      }
    })
    setAllModels(_allModels);

    resetNewModel(); 
    setSelectedModel(null);

  }

  useEffect(() => {
    if (currentModel.model_id) { getModelSettings(); } 
    else { resetNewModel(); }
  }, [currentModel]);

  useEffect(() => {
    if (createModel) { getCourseDeployments(); }
  }, [createModel]);

  return (
    
    <Box className="m-3">
      <Box>
        <Box className="d-flex justify-content-between align-items-center w-100">
          <Heading size={"lg"} style={{ fontWeight: 700}}>
            Model Information
          </Heading>
          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {createModel ? 
          <Box>
            <FormControl fullWidth size="small" className="my-2">
              <InputLabel id="deployment-select-label">Course Deployment</InputLabel>
              <Select 
                placeholder="Select a course deployment"
                required
                variant="outlined"
                size="small"
                onChange={(e) => updateField("deployment_id", e.target.value)}
                value={newModel.deployment_id}
                name={"deployment_id"}
                fullWidth>
                {deploymentList.map((deployment) => ( <MenuItem value={deployment.deployment_id}>{deployment.deployment_name}</MenuItem> ))}
              </Select>
            </FormControl>
          </Box>
          : <></>
        }

      </Box>
      <Box>
        <HStack style={{ margin: 0, padding: 0 }}>
          <p>Enable Model:</p>
          <Switch 
            color="success"
            checked={newModel.status}
            onChange={() => { setNewModel({ ...newModel, status: !newModel.status }); }}
          />
        </HStack>
        <Stack spacing={2}>
            <TextField
              className="my-2"
              label="Name"
              required
              variant="outlined"
              size="small"
              onChange={(e) => updateField("model_name", e.target.value)}
              value={newModel.model_name}
              name={"name"}
              fullWidth
            />

            <TextField
              className="my-2"
              label="Large-Langauge Model"
              required
              variant="outlined"
              size="small"
              onChange={(e) => updateField("model", e.target.value)}
              value={newModel.model}
              name={"model"}
              fullWidth
            />

            <FormLabel 
              className="mt-2"
              id="prompt-label"
            >Description</FormLabel>
            <TextareaAutosize
              className="my-2 border"
              label="Description"
              placeholder="Enter a description for the model"
              required
              onChange={(e) => updateField("model_description", e.target.value)}
              value={newModel.model_description}
              minRows={3}
              style={{ 
                width: "100%",
                padding: "16px",
                overflow: "auto",
                resize: "none",
              }}
            />

            <FormLabel className="mt-2">
              Initial Message
              <TextareaAutosize
                className="my-2 border"
                label="Initial Message"
                placeholder="Enter an initial message for the model"
                required
                onChange={(e) => updateField("default_message", e.target.value)}
                value={newModel.default_message}
                minRows={3}
                style={{ 
                  width: "100%",
                  padding: "16px",
                  overflow: "auto",
                  resize: "none",
                }}
              />  
            </FormLabel>
            
            <FormLabel 
              className="mt-2"
              id="prompt-label"
            >Prompt *</FormLabel>
            <TextareaAutosize
              className="my-2 border"
              label="Prompt"
              required
              onChange={(e) => updateField("prompt", e.target.value)}
              value={newModel.prompt}
              minRows={8}
              style={{ 
                width: "100%",
                padding: "16px",
                overflow: "auto",
              }}
            />
            
            {/* GPT based fields */}
            <Grid container>
              <Grid xs={6}>
                <Grid className="ms-1">
                <TextField
                  className="my-2"
                  label="Max Tokens"
                  required
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  onChange={(e) => updateField("max_tokens", e.target.value)}
                  value={newModel.max_tokens}
                  name={"maxTokens"}
                  fullWidth
                />
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid className="ms-1">
                  <TextField
                    className="mt-2"
                    label="Top P"
                    required
                    variant="outlined"
                    size="small"
                    onChange={(e) => updateField("top_p", e.target.value)}
                    value={newModel.top_p}
                    name={"topP"}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid xs={6}>
                <Grid className="ms-1">
                  <TextField
                    className="mt-2"
                    label="Presence Penalty"
                    required
                    variant="outlined"
                    size="small"
                    onChange={(e) => updateField("presence_penalty", e.target.value)}
                    value={newModel.presence_penalty}
                    name={"presence_penalty"}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid className="ms-1">
                  <TextField
                    className="mt-2"
                    label="Frequency Penalty"
                    required
                    variant="outlined"
                    size="small"
                    onChange={(e) => updateField("frequency_penalty", e.target.value)}
                    value={newModel.frequency_penalty}
                    name={"frequency_penalty"}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid className="ms-1">
                  <TextField
                    className="mt-2"
                    label="Temperature"
                    required
                    variant="outlined"
                    size="small"
                    onChange={(e) => updateField("temperature", e.target.value)}
                    value={newModel.temperature}
                    name={"temperature"}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

        </Stack>
      </Box>
      <Box className="d-flex justify-content-between mt-4">
        <Box className="d-flex">
          {createModel ? 
            <Box className="green-button"
              style={{ cursor: "pointer" }}
              onClick={() => {  if (isValid(newModel)) { createNewModel(); }  }}
            >
              Create Model
            </Box>
          : <Box className="blue-button"
              style={{ cursor: "pointer" }}
              onClick={() => {  if (isValid(newModel)) { updateModel(); }  }}
            >
              Submit Edits
            </Box>}
          {isSubmitting && 
            <Box className="d-flex align-items-center ms-2">
              <CircularProgress size={14} color="info" /> &nbsp;Submitting edits...
            </Box>
          }
        </Box>
        <Box 
          className="red-button" 
          onClick={() => {
            if (createModel) { setCreateModel(false); }
            resetNewModel(); 
            setSelectedModel(null);
          }}>
          Close
        </Box>
      </Box>
    </Box>
  );
};

export default ModelCard;
