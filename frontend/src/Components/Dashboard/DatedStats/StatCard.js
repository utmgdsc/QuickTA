import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Tooltip,
} from "@chakra-ui/react";

const StatCard = ({ title, num, delta, unit, callBack }) => {
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "10px 15px 2px 20px",
    width: "100%",
    textAlign: "left",
  };
  const titleStyle = {
    display: "block",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "25px",
  };

  return (
    <Tooltip label={`Click on me for ${title} csv report`}>
      <Stat
        style={cardStyle}
        onClick={() => {
          callBack();
        }}
        as={"Button"}
      >
        <StatNumber>
          <span style={titleStyle}>{title}</span>
        </StatNumber>
        <StatLabel>
          {num}
          {unit}
        </StatLabel>
        {delta >= 0 ? (
          <StatHelpText>
            <StatArrow type="increase" />
            {delta}% from previous delta
          </StatHelpText>
        ) : (
          <StatHelpText>
            <StatArrow type="decrease" />
            {delta * -1}% from previous delta
          </StatHelpText>
        )}
      </Stat>
    </Tooltip>
  );
};

export default StatCard;
