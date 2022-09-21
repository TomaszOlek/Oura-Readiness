import React from "react";
import Content from "./Content";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";
import { ChakraProvider } from '@chakra-ui/react'


// this is only for local webpack server test  => yarn start
export const LocalComponent = (props) => {
  return (
    <PrifinaProvider stage={"dev"} Context={PrifinaContext}>
      <ChakraProvider>
        <Content stage={"dev"} {...props} />
      </ChakraProvider>
    </PrifinaProvider>
  );
};
