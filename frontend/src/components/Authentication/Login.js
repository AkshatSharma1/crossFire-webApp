import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setEmail(e.target.value)
  }

  const clickEvent = () => setShow(!show);


  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);

    //set up headers
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log((data));
      // console.log("hello")
      toast({
        title: "Login Successful",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false);
      navigate("/chats");
    } catch (error) { //if error occurred during login
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  return (
    <VStack s={1.5}>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          placeholder="Enter your email address"
          // onChange={(e) => setEmail(e.target.value)}
          onPointerLeave={handleChange}
          focusBorderColor="blue.200"
          isRequired="true"
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="blue.200"
            isRequired="true"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={clickEvent}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Submit Button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
