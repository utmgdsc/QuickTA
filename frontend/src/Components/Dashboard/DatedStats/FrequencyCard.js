import {Box, Center, Divider, Flex, HStack, Spacer, Stat, StatLabel, Tag, TagLabel, Text} from "@chakra-ui/react";
import StatCard from "./StatCard";


const FrequencyCard = ({ words }) => {
  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
    borderRadius: '15px',
    padding: '15px 15px 7px 20px',
    width: '99%',
  };
  const titleStyle = {
    display: 'block',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '25px'
  };

  return(
    <Stat style={cardStyle}>
      <StatLabel><span style={titleStyle}>Most Common Words</span></StatLabel>
      <Divider my={3}/>
      <HStack>
        <Text>Less Frequent</Text>
        <Box
          bgGradient={"linear(to-r, #FFFFFF, #2C54A7)"}
          w={'100%'}
          h={'10px'}
          borderRadius={'lg'}
        />
        <Text>More Frequent</Text>
      </HStack>
      <Divider my={3}/>
      <HStack
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: '12px'
        }}
        spacing={3}
      >
        {words.length ===0 ?

          <div style={{
            width: "100%",
            textAlign: "center"
          }}>
            No Common Words
          </div>
          :
          words.map((word, index) => (
            <Tag
              key={index}
              size={'lg'}
              style={{
                backgroundColor: `rgba(44, 84, 167, ${word[1]})`,
              }}
            >
              <TagLabel>{word[0]}</TagLabel>
            </Tag>
          ))
        }
      </HStack>
    </Stat>
  )
}

export default FrequencyCard;