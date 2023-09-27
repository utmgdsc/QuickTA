import { Select, Box } from "@chakra-ui/react";

const ModelSelect = ({ models, setCurrModel, inConvo, currModel, model_id }) => {
  return (
    <Box w="150px">
      {model_id ? <Select placeholder={model_id}
        borderColor="white"
        bg="white"
        boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
        mb={5}/> : 
        <Select
        borderColor="white"
        bg="white"
        boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
        onChange={(e) => {
          setCurrModel(models[parseInt(e.target.value)]);
          sessionStorage.setItem(
            "selectedModel",
            parseInt(e.target.value).toString()
          );
          console.log("selected model", models[parseInt(e.target.value)]);
          console.log(currModel.model_id);
          // Object.keys(courses[parseInt(e.target.value)]).forEach((key) => {sessionStorage.setItem(key, courses[parseInt(e.target.value)][key])});
        }}
        value={parseInt(sessionStorage.getItem("selectedModel"))}
        isDisabled={inConvo}
        mb={5}
      >
        {models.map(({ model_name }, index) => (
          <option key={index} value={index}>
            {model_name}
          </option>
        ))}
      </Select>}
    </Box>
  );
};

export default ModelSelect;
