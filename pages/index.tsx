import { Button, Flex, Grid, Link, Image, Stack, Text, Drawer, useToast,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import React from 'react';
import api from '../product/api';
import { Product } from '../product/types';

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
              duration: 3000,
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
        justifyContent="center"
        bottom={4}
        >
          <Button
          width="fit-content"
          as={Link} 
          href={`https://wa.me/5493512316539?text=${encodeURIComponent(text)}`} 
          isExternal
          colorScheme="whatsapp">
            Completar pedido ({cart.length} productos) - Total = ${cart.reduce((total, product) => total + product.price, 0)}
          </Button>
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