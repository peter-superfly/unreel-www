import Home from "../components/Home";

const IndexPage = (props) => {
  return <Home {...props} block_id />;
};

IndexPage.layout  = 'Public';

export default IndexPage;
