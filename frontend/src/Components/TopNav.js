import {Button, HStack, Spacer, Text} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const TopNav = (props) => {
  return (
    <HStack style={{
      background: "white",
      height: "10vh",
      paddingInline: "5vw",
      fontFamily: "Poppins",
      marginBottom: "5vh"
    }}>
        <span style={{
          fontFamily: "Poppins"
        }}>Quick<span style={{
          fontFamily: "Poppins",
          color: "#012E8A",
          fontWeight: "bold"
        }}>TA</span>
        </span>

      <Spacer/>

      <Text>
        <Text style={{
          fontSize: "xx-small",
        }}>Logged in as</Text>
        <Text style={{
          color: "#012E8A",
        }}>{props.UTORid}</Text>
      </Text>
      <Button>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={"lg"}/>
      </Button>

    </HStack>
  );
}

export default TopNav;
