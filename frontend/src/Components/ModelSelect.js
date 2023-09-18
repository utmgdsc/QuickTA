import { Select, Box } from "@chakra-ui/react";

const ModelSelect = ({ models, setCurrModel, wait, currModel }) => {
  console.log("models", models);
  return (
    <Box w="150px">
      <Select
        borderColor="white"
        bg="white"
        boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
        onChange={(e) => {
          setCurrModel(models[parseInt(e.target.value)]);
          // Object.keys(courses[parseInt(e.target.value)]).forEach((key) => {sessionStorage.setItem(key, courses[parseInt(e.target.value)][key])});
        }}
        value={currModel}
        isDisabled={wait}
        mb={5}
      >
        {models.map(({ model_name }, index) => (
          <option key={index} value={index}>
            {model_name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default ModelSelect;
