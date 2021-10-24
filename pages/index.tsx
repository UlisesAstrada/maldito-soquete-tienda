import { Button, Flex, Grid, Link, Image, Stack, Text, Drawer, useToast, useDisclosure,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  VStack,
  Divider,
  HStack,
  StackDivider} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import React from 'react';
import api from '../product/api';
import { Product } from '../product/types';
import Swal from 'sweetalert2'

interface Props{
  products: Product[];
}

function parseCurrency(value: number) : string {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS'
  })
}


const IndexRoute: React.FC<Props> = ({products}) => {
  
  const [cart, setCart] = React.useState<Product[]>([])



  const text = React.useMemo(() => {
    return cart
    .reduce((message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`), ``)
    .concat(`\nTotal:
    ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`)
  }, [cart])

  
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  
  const btnRef = React.useRef()

  
  const [placement, setPlacement] = React.useState("right")

  return (
    <Stack spacing={6}>
      <Grid gridGap="6" templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
    {products.map(product => (
        <Stack spacing={3} borderRadius="md" padding={4} backgroundColor="gray.100" key={product.id}>
          <Stack spacing={1}>
          <Image alt="" src={product.image} maxHeight={250} objectFit="contain" borderTopRadius="md"/>
          <Text>{product.title}</Text>
          <Text fontSize="sm" fontWeight="500" color="green.500">{parseCurrency(product.price)}</Text>
          </Stack>

          <Button 
          size="sm" 
          colorScheme="primary" 
          variant="outline" 
          onClick={() => {
            setCart(cart => cart.concat(product))
            toast({
              title: "Producto añadido!",
              description: `Agregaste ${product.title} al carrito`,
              status: "success",
              duration: 1500,
              isClosable: true,
            })
          }}
          >
            Agregar
          </Button>
        </Stack>
      ))}
      </Grid>
      {Boolean(cart.length) && (
        <Flex
        alignItems="center"
        justifyContent="space-around"
        bottom={4}
        >
          <VStack maxWidth={150}>
          <Button
          width={{base: "289px", md: "container.md"}}
          fontSize={{base: "sm", md: "md"}}
          as={Link} 
          href={`https://wa.me/5493512316539?text=${encodeURIComponent(text)}`} 
          isExternal
          colorScheme="whatsapp">
            Completar pedido ({cart.length} productos)- 
            Total = ${cart.reduce((total, product) => total + product.price, 0)}
          </Button>
          <HStack>
          <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Ver Carrito
      </Button>
      <Button colorScheme="red" onClick={() => Swal.fire({
  title: '¿Querés vaciar el carrito?',
  text: "¡Vas a perder todos los productos que agregaste!",
  icon: 'warning',
  showCancelButton: true,
  cancelButtonText: '¡No, cancelar!',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: '¡Sí, vaciar!'
}).then((result) => {
  if (result.isConfirmed) {
    setCart([])
    Swal.fire(
      '¡Carrito vaciado!',
      'Los productos fueron quitados',
      'success'
    )
  }
})}>
        Vaciar Carrito
      </Button>
          </HStack>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Tu carrito 😎</DrawerHeader>

          <DrawerBody>
            {cart.map((product) => (<><Stack><Text><b>{product.title}</b></Text><Image alt={product.title} key={product.id} src={product.image} 
            maxWidth={200} maxHeight={280}/></Stack></>))}

            <Text><b>{cart.length} productos añadidos -
            Total = ${cart.reduce((total, product) => total + product.price, 0)}</b></Text>
    
          </DrawerBody>

          <DrawerFooter>
            <Button 
            as={Link} 
            href={`https://wa.me/5493512316539?text=${encodeURIComponent(text)}`} 
            isExternalvariant="outline" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button 
            colorScheme="whatsapp"
            as={Link} 
            href={`https://wa.me/5493512316539?text=${encodeURIComponent(text)}`} 
            isExternal>Completar pedido</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
          </VStack>
        </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  
  const products = await api.list()
  
  return {
    props: {
      products,
    },
    revalidate: 10
  }
}

export default IndexRoute;