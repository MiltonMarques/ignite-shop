import Head from "next/head";
import Image from "next/image"
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { ImageContainer, SuccessContainer } from "./styles/pages/success";

interface SuccessProps {
    custmerName: string;
    product:{
        name: string;
        imageUrl:string;
    }
}

export default function Success({custmerName, product}: SuccessProps) {
    return(
        <>
     <Head>
      <title>Compra efetuada | Ignite shop</title>
      <meta name="robots" content="noindex" />
     </Head>

        <SuccessContainer>
            <h1>Compra efetuada!</h1>

            <ImageContainer>
                <Image src={product.imageUrl} width={120} height={110} alt=""/>
            </ImageContainer>
           
            <p>Uhuul <strong>{custmerName}</strong>, sua <strong>{ product.name}<br/> Limites</strong> já está a caminho da sua casa.</p>

            <Link href="/">
                Voltar ao catalago
            </Link>
        </SuccessContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({query,params}) => {
    if(query.session_id){
        return{
            redirect:{
                destination: '/',
                permanent: false,
            }
        }
    }
const sessionId = String(query.session_id)

const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand:['line_items','line_items.data.price.product']
})
const custmerName = session.customer_details.name
const product = session.line_items.data[0].price.product as Stripe.Product

return {
    props:{
        custmerName,
        product:{
            name:product.name,
            imageUrl:product.images[0],
         }
      }
    }
    
}
