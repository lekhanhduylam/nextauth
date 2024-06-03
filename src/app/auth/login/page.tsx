"use client";
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as yup from "yup";

interface LoginInput {
  password: string;
  email: string;
}

const schema = yup.object().shape({
  password: yup.string().min(5).required(),
  email: yup.string().email().required(),
});


export default function Login() {
  const formBg = useColorModeValue("white", "gray.700");
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  async function onSubmit(formData: any) {
    console.log({ formData });
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      ...formData,
    });

    if (res?.ok) {
      router.push('/')
    }
    if (res?.error) {
      toast({
        title: "Account is invalid.",
        description: "Credentials do not match!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  const handleSocialSignIn = async (type: "google" | "facebook") => {
    const res = await signIn(type, {
      callbackUrl: "/",
    });
    if (res?.ok) {
      router.push('/')
    }
    if (res?.error) {
      toast({
        title: "Sign in failed",
        description: res.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={formBg} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors?.email?.message}>
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isInvalid={!!errors?.password?.message}
              >
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register("password")} />
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"}>Forgot password?</Link>
                </Stack>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
          <Box position="relative" padding="10">
            <Divider color={useColorModeValue("gray.600", "white")} />
            <AbsoluteCenter bg={formBg} px="4">
              <Text color={useColorModeValue("gray.600", "white")}>OR</Text>
            </AbsoluteCenter>
          </Box>
          <Stack spacing={4}>
            {/* Facebook */}
            <Button
              w={"full"}
              colorScheme={"facebook"}
              leftIcon={<FaFacebook />}
            >
              <Center>
                <Text>Sign in with Facebook</Text>
              </Center>
            </Button>

            {/* Google */}
            <Button
              w={"full"}
              variant={"outline"}
              leftIcon={<FcGoogle />}
              onClick={() => handleSocialSignIn("google")}
            >
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
