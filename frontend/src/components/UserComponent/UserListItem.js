import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { IoMdPersonAdd } from "react-icons/io";

//handleFunction passed as prop
const UserListItem = ({ user, handleFunction, onClick }) => {
  return (
    <Box
      display="flex"
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={
          user.pic !==
          `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
        }
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      {/* <ButtonGroup size="sm" isAttached variant="outline">
        <IconButton aria-label="Add to friends" icon={<IoMdPersonAdd />} />
      </ButtonGroup> */}
    </Box>
  );
};

export default UserListItem;
