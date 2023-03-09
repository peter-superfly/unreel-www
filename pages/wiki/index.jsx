import Docs from "@/components/Docs";
import { wikiPage, state_while_reval, maxage } from '@/lib/constant';
import { fetchData } from "@/lib/request";

const IndexPage = (props) => {
  return (
    <div className="wiki-page-section">
      <Docs {...props} />
    </div>
  )
};

export async function getServerSideProps({ req, res }) {

  const { block_id, baseManu } = wikiPage;
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

IndexPage.layout = 'Private';

export default IndexPage;
