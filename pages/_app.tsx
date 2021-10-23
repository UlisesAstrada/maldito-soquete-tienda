import React from "react"
import { ChakraProvider, Image, Container, VStack, Heading, Text, Box, Divider} from "@chakra-ui/react"
import { AppProps } from "next/app"
import theme from "../theme"

const App:React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
      <Container
      borderRadius="sm" 
      backgroundColor="white"
      boxShadow="medium"
      maxWidth="container.xl"
      padding={4}
      >
        <VStack marginBottom={6}>
          <Image borderRadius={9999} alt="an image" src="//placehold.it/128x128"></Image>
          <Heading>Maldito Soquete</Heading>
          <Text>Tu tienda de zoquetes 🤘</Text>
        </VStack>
        <Divider marginY={6}/>
        <Component {...pageProps} />
      </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App