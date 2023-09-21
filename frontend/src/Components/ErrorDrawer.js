import {Drawer, DrawerContent, DrawerOverlay, DrawerHeader, DrawerBody, DrawerCloseButton} from "@chakra-ui/react";
import React from "react";


const ErrorDrawer = ({ isOpen, onClose, error }) => {

    return(<Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Error</DrawerHeader>
          <DrawerBody>
            {error && error.message}
          </DrawerBody>
        </DrawerContent>
      </Drawer>)
};

export default ErrorDrawer;