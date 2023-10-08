import {
    Box,
    Button,
    Center,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    Skeleton,
    ButtonGroup,
    IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import TopNav from "../Components/TopNav";
import axios from "axios";
import { useEffect, useState } from "react";
import CourseDrawer from "../Components/AdminView/CourseDrawer";
import CourseCreator from "../Components/Dashboard/CourseCreator";
import { AiFillContainer } from "react-icons/ai";
import NotFoundPage from "../Components/NotFoundPage";
import ErrorDrawer from "../Components/ErrorDrawer";
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
// When using TypeScript 4.x and above
import { createTheme } from '@mui/material/styles';

const SettingPage = ({ UTORID, auth }) => {
const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
} = useDisclosure();
const [error, setError] = useState();


const rows = [
{ id: 1, col1: 'Hello', col2: 'World' },
{ id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
{ id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
{ field: 'col1', headerName: 'Column 1', width: 150 },
{ field: 'col2', headerName: 'Column 2', width: 150 },
];



const theme = createTheme({
    components: {
        // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
        MuiDataGrid: {
        styleOverrides: {
            root: {
            backgroundColor: 'red',
            },
        },
        },
    },
});


if (auth !== "AM") {
    return <NotFoundPage />;
}

return UTORID.length !== 0 ? (
    <div
    style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "100vh",
    }}
    >
    <TopNav UTORid={UTORID} auth={auth} />
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"}>
        <Box>Test</Box>
        <DataGrid rows={rows} columns={columns} />
    </Box>
    <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </div>
) : null;
};

export default SettingPage;
