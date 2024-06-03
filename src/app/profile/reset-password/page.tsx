"use client";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface ResetPasswordModel {
  currentPassword: string;
  newPassword: string;
}

const schema = yup.object().shape({
  currentPassword: yup.string().nullable().min(5).required(),
  newPassword: yup.string().nullable().min(5).required(),
});

export default function ResetPasswordForm(): JSX.Element {
  const toast = useToast();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordModel>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: ResetPasswordModel) => {
    const { currentPassword, newPassword } = formData;
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        status: "info",
        title: "Change password success",
      });
    } else {
      toast({
        status: "error",
        title: data.error || "Change password failed",
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Enter new password
          </Heading>
          <FormControl
            id="currentPassword"
            isRequired
            isInvalid={!!errors.currentPassword?.message}
          >
            <FormLabel>Current password</FormLabel>
            <Input
              {...register("currentPassword")}
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
            <FormErrorMessage>
              {errors.currentPassword?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="password"
            isRequired
            isInvalid={!!errors?.newPassword?.message}
          >
            <FormLabel>New password</FormLabel>
            <Input type="password" {...register("newPassword")} />
            <FormErrorMessage>{errors?.newPassword?.message}</FormErrorMessage>
          </FormControl>
          <Stack spacing={6}>
            <Button
              type="submit"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </Flex>
  );
}
