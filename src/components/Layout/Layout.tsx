import React from 'react';
import Head from 'next/head';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from './Header';
import { Footer } from './Footer';

export function Layout(props: { children: React.ReactNode; title?: string; description?: string }): JSX.Element {
  return (
    <div>
      <Head>
        <title>{props.title ? props.title : 'Book Best Hotels for your holiday'}</title>
        {props.description && <meta name="description" content={props.description} />}
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Header />
      <ToastContainer position="bottom-right" />
      {props.children}
      <Footer />
    </div>
  );
}
