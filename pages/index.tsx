import { Button, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react';
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

  return (
    <Stack spacing={6}>
      <Grid gridGap="6" templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
    {products.map(product => (
        <Stack spacing={3} borderRadius="md" padding={4} backgroundColor="gray.100" key={product.id}>
          <Stack spacing={1}>
          <Text>{product.title}</Text>
          <Text fontSize="sm" fontWeight="500" color="green.500">{parseCurrency(product.price)}</Text>
          </Stack>
          <Button size="sm" colorScheme="primary" variant="outline" onClick={() => setCart(cart => cart.concat(product))}>
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
            Completar pedido ({cart.length} productos)
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
    revalidate: 120
  }
}

export default IndexRoute;