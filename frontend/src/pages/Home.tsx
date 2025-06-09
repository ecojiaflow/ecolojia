import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
} from 'react-instantsearch-hooks-web';
import { searchClient } from '@/lib/algolia';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <InstantSearch indexName="products" searchClient={searchClient}>
      <div className="p-6 space-y-4">
        <SearchBox placeholder="Rechercher un produit éthique..." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-4">
            <RefinementList attribute="tags" />
            <RefinementList attribute="confidence_color" />
          </div>
          <div className="col-span-3">
            <Hits hitComponent={({ hit }) => <ProductCard hit={hit as any} />} />
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}