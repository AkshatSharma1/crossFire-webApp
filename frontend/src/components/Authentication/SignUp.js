import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";

import validator from "validator"; //password validator

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [picloading, setPicLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passerror, setPassError] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const clickEvent = () => setShow(!show);

  let regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  const handleChange = (e) => {
    console.log(e.target.value);
    if (!regex.test(e.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }

    setEmail(e.target.value);
  };

  console.log(error);
  console.log(regex.test(email));

  //password validator
  const validate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPassword(value);
      setPassError("");
    } else {
      setPassError("Please enter a strong password(include Capital, Numeral, Special characters...)");
    }
  };
  console.log(passerror)

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      // console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats"); //tp redirect user to chats page
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  //user pic
  const uploadPic = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "vcChat");
      data.append("cloud_name", "dhfzeratq");
      fetch("https://api.cloudinary.com/v1_1/dhfzeratq/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false); //cause pic has been uploaded
        })
        .catch((err) => {
          console.log(err);
          // console.log("hello")
          setPicLoading(false);
        });
    } else {
      //show a warning if image type not correct
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <VStack spacing={1.5}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          id="name"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          focusBorderColor="blue.200"
          isRequired="true"
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          onChange={handleChange}
          focusBorderColor="blue.200"
          isRequired
          value={email}
        />
        {error && <h3 style={{ color: "red" }}>{error}</h3>}
      </FormControl>

      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            id="password"
            placeholder="Enter password (Min. 8 characters)"
            onChange={(e) => validate(e.target.value)}
            focusBorderColor="blue.200"
            isRequired="true"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={clickEvent}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {passerror === "" ? null : <h3 style={{ color: "red" }}>{passerror}</h3>}
      </FormControl>
      <FormControl id="confirm">
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={show ? "text" : "password"}
          id="confirm"
          placeholder="Confirm password"
          onChange={(e) => setConfirmpassword(e.target.value)}
          focusBorderColor="blue.200"
          isRequired="true"
        />
      </FormControl>
      <FormControl id="userpic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          id="userpic"
          type="file"
          accept="image/"
          p={1.5}
          onChange={(e) => uploadPic(e.target.files[0])}
          focusBorderColor="blue.200"
          isRequired="false"
        />
      </FormControl>

      {/* Submit Button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picloading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
