import { GrDocumentText } from 'react-icons/gr';
import { MdDoubleArrow } from 'react-icons/md';
import { FaWikipediaW } from 'react-icons/fa';
import { HiOutlineDocumentText } from "react-icons/hi";
const getParentsTitle = (page) => {
	let titles = [];
	try {
		let hasParent = true;
		let pageId = page?.raw?.page?.id
		while (hasParent) {
			const block = page.block[pageId];
			if (block) {
				pageId = block?.value?.parent_id;
				const title = block?.value?.properties?.title[0];
				if (title) titles.push(title);
			} else {
				hasParent = false;
			}
			if (!pageId) {
				hasParent = false;
			}
		}
	} catch (error) {
		console.error(error)
	}
	return titles;
}

const getTitle = (page) => {
	try {
		const type = page?.type;
		
		let baseIcon = <GrDocumentText size={30} />;
		let docType = '';
		if(type === 'docs') {
			baseIcon = <HiOutlineDocumentText size={30} />
			docType = 'Docs';
		} else if(type === 'wiki') {
			baseIcon = <FaWikipediaW size={30} />
			docType = 'Wiki';
		}
		let breadcrumbs = <></>
		const titles = getParentsTitle(page);
		for (var i = titles.length - 1; i >= 0; i--) {
			const breadcrumb = <><span>  <MdDoubleArrow size={15} /> </span> {titles[i]}</>
			breadcrumbs = <>{breadcrumbs} {breadcrumb}</>
		}
		let title = page?.raw?.page?.properties?.title?.title[0]?.plain_text;
		title = <> {baseIcon} {docType} {breadcrumbs}  </>
		return title;
	} catch (error) {
		return '';
	}
}

const getParagraphs = (children) => {
	const paragraphs = [];
	try {
		let childLength = children.length
		if (childLength > 3) childLength = 3
		for (let i = 0; i < childLength; i++) {
			if (children[i]?.paragraph?.rich_text) {
				paragraphs.push(children[i].paragraph.rich_text[0]?.plain_text?.value);
			}
		}
	} catch (error) {
		console.log(error)
	}
	return paragraphs
}

export const searchResult = (page) => {
	try {
		return {
			type: page.type,
			block_id: page.objectID,
			title: getTitle(page),
			paragraphs: getParagraphs(page._highlightResult.raw.children)
		}
	} catch (error) {
		return {}
	}
}

