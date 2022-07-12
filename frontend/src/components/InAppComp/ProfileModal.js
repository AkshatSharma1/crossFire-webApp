import React from "react";
import { useDisclosure, Button, Image, Text } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  ModalCloseButton,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* if children is there then show modal else eye icon */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      {/* Modal building */}
      <Modal size="md" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="340px">
          <ModalHeader
            fontFamily="Work Sans"
            fontSize="28px"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" pb={2} flexDir="column" alignItems="center" justifyContent="space-between">
            {/* here we will profile pic */}
            <Image 
             borderRadius="full"
             boxSize="120px"
             src={user.pic}
             alt={user.name}
            />

            <Text 
          
              fontSize={{base: "26px", md:"24px"}}
              fontFamily="Work Sans"
            >
                Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter mt={-3}>
            <Button onClick={onClose} colorScheme="green">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
