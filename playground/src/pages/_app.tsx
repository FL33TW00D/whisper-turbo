import '../styles/globals.css';
import type { AppProps } from 'next/app'
import "react-responsive-modal/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
