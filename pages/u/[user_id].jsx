import User from "@/components/User";
import { state_while_reval, maxage } from '@/lib/constant';
import { fetchUser } from "@/lib/request";

const IndexPage = (props) => {
  if (props?.pages) {
    return <User className={"theme-verde"} {...props} block_id />;
  } else return "";
};

export async function getServerSideProps({ req, res, query }) {
  let { user_id } = query;

  let is_media = user_id.match(/\.(jpeg|jpg|gif|svg|mp4|png)$/) != null;

  if (is_media) {
    return { props: {} };
  } else {

  
    const requestAction = req.cookies?.requestAction
  
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${maxage}, stale-while-revalidate=${state_while_reval}`
    );
  
    const option = {
      method: requestAction ? 'PUT' : 'GET'
    }

    req.indexName='wiki-xxx'
    const pages = await fetchUser(req, 'api/user', user_id, option)
  
    if (!pages) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: { pages: pages }
    };
  }
}

IndexPage.layout  = 'Private';

export default IndexPage;
