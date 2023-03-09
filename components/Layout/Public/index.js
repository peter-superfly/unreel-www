import { Fragment } from "react";
import PublicHeader from "./Header";
import PublicFooter from "./Footer";

const PublicLayout = ({ children }) => {
	return (
		<Fragment>
			<div className="app-public-container">
			<div className="next-public-header container mx-auto">
				<PublicHeader />
			</div>
			<div className="app-public-main-section mx-auto">
				{children}
			</div>
			<div className="app-public-footer">
				<PublicFooter />
			</div>
			</div>
		</Fragment>
	)
}

export default PublicLayout;