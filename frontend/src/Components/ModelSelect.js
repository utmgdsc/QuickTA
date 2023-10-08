import { Box } from "@chakra-ui/react";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ModelSelect = ({
  models,
  setCurrModel,
  inConvo,
  currModel,
  model_id,
}) => {
  return (
    <Box minW="100px" maxW="235px" ml={4}>
    <FormControl fullWidth size="small" disabled={inConvo}>
      <InputLabel id="model-select-label" style={{fontFamily: 'Poppins'}}>Model</InputLabel>
      {model_id ? (
        <Select
          placeholder={model_id}
          labelId="model-select-label"
          label="Model"
          style={{
            background: "white",
            // border: "1px solid transparent",
            borderRadius: "5px",
            fontFamily: 'Poppins',
            boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
          }}
          mb={5}
        />
      ) : (
        <Select
          sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
          placeholder="No Model Selected"
          onChange={(e) => {
            setCurrModel(models[parseInt(e.target.value)]);
            sessionStorage.setItem("selectedModel",parseInt(e.target.value).toString());
          }}
          labelId="model-select-label"
          label="Model"
          style={{
            background: "white",
            // border: "1px solid transparent",
            borderRadius: "5px",
            boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
            fontFamily: 'Poppins',
          }}
          mb={5}
          value={parseInt(sessionStorage.getItem("selectedModel"))}
          isDisabled={inConvo}
        >
          {models.map(({ model_name }, index) => (
            <MenuItem key={index} value={index} style={{
              lineHeight: '1.2',
              fontSize: '14px',
              paddingLeft: '8px',
              paddingRight: '8px',
              fontFamily: 'Poppins',
            }}>
              {model_name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
    </Box>
  );
};

export default ModelSelect;
