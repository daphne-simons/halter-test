import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Application from "./application";
import { ChakraProvider, Flex } from "@chakra-ui/react";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <ChakraProvider>
      <Flex width="full" height="full" overflow="hidden">
        <Application />
      </Flex>
    </ChakraProvider>
  </BrowserRouter>
);
