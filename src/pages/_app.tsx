import { AppProps } from "next/app";
import React from "react";
import { globalStyles } from "./styles/global";

import Image from 'next/image'
import logoSvg from '../assents/logo.svg'
import { Container, Header } from "./styles/pages/app";

globalStyles()
export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <Container>
    <Header>
    <Image src={logoSvg}  alt="" />
      
    </Header>
    <Component {...pageProps} />
    </Container>
  )
}
