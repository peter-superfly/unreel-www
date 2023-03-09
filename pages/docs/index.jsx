import Docs from "@/components/Docs";
import { appDocs, state_while_reval, maxage } from '@/lib/constant';
import { fetchData } from "@/lib/request";

const IndexPage = (props) => {
  return <Docs {...props} />;
};

export async function getServerSideProps({ req, res }) {

  const { block_id } = appDocs;
  const requestAction = req.cookies?.requestAction

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${maxage}, stale-while-revalidate=${state_while_reval}`
  );

  const option = {
    method: requestAction ? 'PUT' : 'GET'
  }
  const pages = await fetchData(req, 'api/block', block_id, option)

  if (!pages) {
    return {
      notFound: true,
    };
  }

  return {
    props: { pages: pages }
  };
}

IndexPage.layout  = 'Private';

export default IndexPage;
