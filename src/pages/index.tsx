import { HomeContainer, Product } from "./styles/pages/home";
import Head from "next/head";
import { GetStaticProps } from "next";
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import Link from "next/link";

import Image from "next/image";

import { stripe } from "../lib/stripe";
import Stripe from "stripe";

interface HomePrps {
 products:{
  [x: string]: any;
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  defaultPriceId: string;
 }
}[]

export default function Home( { products }: HomePrps) {
  const [slideRef] = useKeenSlider({
    slides:{
      perView:3,
      spacing: 48,
    },
  })

  return (
    <>
    <Head>
      <title>Home | Ignite shop</title>
    </Head>

    <HomeContainer ref={slideRef} className="keen-slider">
       {products.map(product => {
        return(
          <Link href={`/product/${product.id}`}  key={product.id} prefetch={false}>
              <Product className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={420} alt="" />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
        </Product>
        </Link>
        )
       })}
    </HomeContainer>
    </>
  )  
}

export const getStaticProps: GetStaticProps = async() => {
    const response = await stripe.products.list({
      expand: ['data.default_price']
    })

    const products = response.data.map(product => {
      const price = product.default_price as Stripe.Price

      return{
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR',{
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount /100),
        defaultPriceId: price.id,
      }
    })
    return{
      props:{
        products,
      },
      revalidate: 60 * 60 * 2,
    }
}