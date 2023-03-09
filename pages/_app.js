import "../styles/App.scss";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@auth0/nextjs-auth0";
import GlobalProvider from "@/lib/context/global";

import PublicLayout from "@/components/Layout/Public";
import PrivateLayout from "@/components/Layout/Private";
import ContentLayout from "@/components/Layout/Content";

import { getNavMenu } from "@/lib/algolia";
import { useRouter } from "next/router";
import * as ga from "../lib/googleAnalytics";
import { useEffect } from "react";

const layouts = {
  Public: PublicLayout,
  Private: PrivateLayout,
  ContentLayout: ContentLayout,
};

function MainApp({ Component, pageProps, props }) {
  const Layout = layouts[Component?.layout] || ((children) => <>{children}</>);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <GlobalProvider>
      <UserProvider>
        <ThemeProvider defaultTheme="system">
          <Head>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            ></script>
            <script async src='/js/ga4.js'></script>
            <title>Vertex</title>
            <link rel="icon" type="image/x-icon" href="favicon.svg" />
          </Head>
          <Layout>
            <Component {...pageProps} {...props} />
          </Layout>
        </ThemeProvider>
      </UserProvider>
    </GlobalProvider>
  );
}

MainApp.getInitialProps = async ({ ctx }) => {
  const { pathname } = ctx;
  let pageName = "appDocs";
  if (pathname.startsWith("/wiki")) pageName = "wikiPage";
  const menu = await getNavMenu(pageName);
  return {
    props: {
      menu: menu,
    },
  };
};

export default MainApp;
