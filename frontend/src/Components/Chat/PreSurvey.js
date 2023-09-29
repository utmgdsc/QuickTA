import { Modal } from "@chakra-ui/react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";

const PreSurvey = ( { isOpen, onClose } ) => {

    const fetchPreSurvey = () => {
        axios.get(process.env.REACT_APP_API_URL + '/survey/details?survey_id=d18676a6-4419-4ae6-beda-97bc26377942', {
        })
        .then((res) => {

        })
        .catch((err) => {
            setError(err);
            onErrOpen();
        });
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Pre-Survey</ModalHeader>
                <ModalBody>
                    <p>Pre-Survey</p>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default PreSurvey;