import { Button, Grid, Link, Stack, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import React from 'react';
import api from '../product/api';
import { Product } from '../product/types';

interface Props{
  products: Product[];
}


const IndexRoute: React.FC<Props> = ({products}) => {
  
  const [cart, setCart] = React.useState<Product[]>([])

  const text = React.useMemo(() => {
    return cart
    .reduce((message, product) => message.concat(`* ${product.title} - $${product.price}\n`), ``)
    .concat(`\nTotal: ${cart.reduce((total, product) => total + product.price, 0)}`)
  }, [cart])

  return (
    <Stack>
      <Grid gridGap="6" templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
    {products.map(product => (
        <Stack backgroundColor="gray.100" key={product.id}>
          <Text>{product.title}</Text>
          <Text>{product.price}</Text>
          <Button colorScheme="blue" onClick={() => setCart(cart => cart.concat(product))}>
            Agregar
          </Button>
        </Stack>
      ))}
      </Grid>
      {Boolean(cart.length) && (
          <Button 
            as={Link} 
            href={`https://wa.me/5493512316539?text=${encodeURIComponent(text)}`} 
            isExternal 
            colorScheme="whatsapp">
              Completar pedido ({cart.length} productos)
          </Button>
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