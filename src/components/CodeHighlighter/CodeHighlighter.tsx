"use client";
import { Box, Flex, IconButton, Text, useColorMode, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdContentCopy, MdOutlineCheckCircle, MdCode, MdKeyboard, MdAddCircle, MdDelete } from "react-icons/md";
import { CodeHighlighterProps, SnippetDataType } from "@/TYPES";
import UsagePopup from "./UsagePopup";
import { decodeString } from "@/helpers/formatString";
import { addToFavorites, removeFromFavorites } from "@/api/api";
import { useRouter } from "next/navigation";

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  _id = "",
  title = "",
  author = "SayShark",
  code = "",
  language = "jsx",
  description = "",
  isFavorite = false,
  getFavoriteData = () => {},
}: SnippetDataType) => {
  const navigation = useRouter();
  const { colorMode } = useColorMode();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    if (isCopy) {
      window.navigator.clipboard.writeText(decodeString(code));
      setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }
  }, [code, isCopy]);

  const addSnippetToFavorites = async (snippetID: string) => {
    try {
      const res = await addToFavorites(snippetID);
      if (res.status) {
        toast({
          title: "Added to Favorites",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Please Login First",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigation.push("login");
    }
  };

  const removeSnippetFromFavorites = async (snippetID: string) => {
    try {
      const res = await removeFromFavorites(snippetID);
      if (res.status) {
        toast({
          title: "Removed from Favorites",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        getFavoriteData();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Box p={[2, 8]} w={"100%"}>
      <Box w={"100%"} bgColor={"light.100"} border={"1px solid"} borderColor={"light.300"} rounded={"lg"} px={3}>
        <Flex
          w={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          borderBottom={"1px solid"}
          borderBottomColor={"light.300"}
          p={2}
          gap={2}
        >
          <Text
            as={Flex}
            ml={4}
            direction={["column", "column", "row"]}
            justifyContent={"flex-start"}
            alignItems={["flex-start", "flex-start", "center"]}
            gap={[1, 2]}
            fontSize={["12px", "12px", "18px"]}
            textTransform={"capitalize"}
          >
            <Text as={Flex} w={"max-content"} alignItems={"center"} gap={2}>
              {title}{" "}
            </Text>
            <Text as={Flex} alignItems={"center"} gap={2}>
              <MdCode /> By {author}
            </Text>{" "}
            <Text as={Flex} w={"max-content"} alignItems={"center"} gap={2}>
              <MdKeyboard /> language: {language}
            </Text>
          </Text>

          <Flex flexWrap={"wrap"} justifyContent={"flex-end"} gap={[1, 4]} alignItems={"center"}>
            {description && <UsagePopup content={description} />}
            {isCopy ? (
              <IconButton
                fontSize={"16px"}
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={"light.300"}
                rounded={"md"}
                icon={<MdOutlineCheckCircle />}
                aria-label="Copy The Code"
              />
            ) : (
              <IconButton
                fontSize={"16px"}
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={"light.300"}
                rounded={"md"}
                icon={<MdContentCopy />}
                onClick={() => setIsCopy(true)}
                aria-label="Copy The Code"
              />
            )}
          </Flex>
        </Flex>
        <Box w={"100%"} overflow={"hidden"} fontSize={["12px", "12px", "14px", "16px"]}>
          <Box w={"100%"} minW={"280px"} overflow={"auto"} maxH={"400px"}>
            <Box w={"100%"} minH={"100%"} bgColor={"violet"}>
              <SyntaxHighlighter showLineNumbers language={language} style={colorMode === "light" ? coy : materialDark}>
                {decodeString(code)}
              </SyntaxHighlighter>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeHighlighter;
