import { DownloadIcon } from "@chakra-ui/icons";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spacer,
} from "@chakra-ui/react";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const StatCard = ({ title, label, miniLabel, helpText, callBack }) => {
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "15px 15px 15px 20px",
    width: "100%",
    textAlign: "left",
    height: "100%",
    alignItems: "start",
    display: "flex"
  };

  const titleStyle = {
    display: "block",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "20px",
  };

  const tooltipStyle = {
    background: "#2F3747",
    color: "white",
    paddingLeft: "2px",
    paddingRight: "2px",
    borderRadius: "8",
    fontSize: "12px"
  };

  const numberStyle = {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "24px",
    lineHeight: "36px",
    color: "#2d3748",
    letterSpacing: "-0.05em",
  };

  const miniNumberStyle = {
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "12px",
    color: "#718096",
  }

  const helpTextStyle = {
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "12px",
    color: "#718096",
  }

  const downloadButtonStyle = {
    backgroundColor: "#EFF3FB33",
    color: "#8CA9E3"
  }

  return (
      <Stat style={cardStyle} onClick={callBack}>
        
        {/* Stat Header / Title */}
        <Box className="d-flex align-items-center">
          <StatLabel>
            <span style={titleStyle}>{title}</span>
          </StatLabel>
          <Spacer />
          <Tooltip title={`Click on me for ${title} csv report`}>
            <IconButton onClick={callBack} size={"small"} style={downloadButtonStyle}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stat Figure / Content */}
        <Box className="d-flex align-items-end">
          <StatNumber style={numberStyle}>
            {label || "-"} 
          </StatNumber>
          {miniLabel && <span style={miniNumberStyle}>{miniLabel}</span>}
        </Box>
        
        {/* Stat Helper */}
        <StatHelpText style={helpTextStyle}>{helpText || ""}</StatHelpText>
      </Stat>
    // </Tooltip>
  );
};

export default StatCard;
