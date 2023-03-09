import React, { Fragment, useState, useEffect } from "react";
import algoliasearch from "algoliasearch";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

export const client = algoliasearch('KX1MNDQVPV', 'e9353ad80b9a658ecceb342c35a77450');
const index = client.initIndex('pages');

import { searchResult } from "./utils";

const AlgoliaSearch = ({handleSearchModel}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [facetsList, setFacetsList] = useState(['docs', 'wiki']);

	useEffect(() => {
		if(searchQuery) {
			const e = {target: {value: searchQuery}};
			handleChange(e);
		}
	},[facetsList])

	async function handleChange(event) {
		setSearchQuery(event.target.value)
		if (event.target.value.length > 3) {
			setSearchQuery(event.target.value);
			index.search(event.target.value, { hitsPerPage: 10 }).then(results => {
				let data = [];
				results.hits.forEach((page) => {
					const result = searchResult(page);
					if(facetsList.includes(result.type)) {
						data.push(result);
					}
				});
				setFiltered(data);
			})
		}
		if (event.target.value.length === 0) setFiltered([]);
	}

	function handleFacetChange(event) {
		let facets = [...facetsList];
		if(facets.includes(event.target.name)) {
			facets = facets.filter(f => f !== event.target.name );
		} else{
			facets.push(event.target.name);
		}
		setFacetsList(facets);
	}

	return (
		<Fragment>
			<div className="algolia-search-container">
				<div className="mx-0 sm:mx-10 px-2 sm:px-4">
					<div className="search-input relative w-full">
						<button type="button" className="flex absolute inset-y-0 left-0 items-center pl-3">
							<HiSearch size={25} color="gray" />
						</button>
						<input
							onChange={handleChange}
							value={searchQuery}
							type="text"
							className="bg-gray-50 border rounded-lg w-full"
							placeholder="Search"
						/>
					</div>
					<div className="flex py-4 mt-4">
						<div className="flex pr-4">
							<input checked={facetsList.includes('docs')} type="checkbox" name='docs' className="w-5 h-5 rounded" onChange={handleFacetChange} />
							<label className="doc-type-container text-gray-900 px-2">Docs</label>
						</div>
						<div>
							<input checked={facetsList.includes('wiki')} type="checkbox" name='wiki' className="w-5 h-5 rounded" onChange={handleFacetChange} />
							<label className="doc-type-container text-gray-900 px-2">Wiki</label>
						</div>
					</div>
				</div>

				<div className="result-container">
					<div className="results">
						{filtered.map((data, i) => {
							return (
								<div key={i} className="item">
									<Link href={data.block_id}><a onClick={ () => {handleSearchModel(false)}}> {data.title}</a></Link>
									{data.paragraphs.map((p, i) => {
										return (<p key={i} className="paragraphs"> 
										    <div dangerouslySetInnerHTML={{__html: p }} />
										</p>)
									})}
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default AlgoliaSearch;