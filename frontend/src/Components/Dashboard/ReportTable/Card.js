


const Card = ({Title, Value, delta}) => {
    return(
        <Box borderRadius={"lg"}>
            <Text>{Title}</Text>
            <Text>{Value}</Text>
            {/* Swtich chevron when delta is neg or pos val */}
        </Box>
    )
}

export default Card;