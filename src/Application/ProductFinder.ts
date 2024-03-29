import { DirectBroker } from "../Domain/Broker";
import { Event } from "../Domain/Event";
import { Paginator } from "../Domain/Paginator";
import { ProductParser } from "../Domain/ProductParser";
import { PageFetcher } from "../Domain/PageFetcher";

export class ProductFinder {
    constructor(
        private pageFetcher: PageFetcher,
        private productParser: ProductParser,
        private paginator: Paginator,
        private broker: DirectBroker,
    ) { }

    async start() {
        try {
            let currentProductsFound = 0;
            let totalProductsFound = 0;
            do {
                const page = await this.pageFetcher.getPage(
                    this.paginator.limit,
                    this.paginator.getOffset(),
                    this.paginator.getPage()
                );
                console.log(`page: ${this.paginator.getPage()}`);
                const products = this.productParser.getAll(page);
                currentProductsFound = products.length;
                totalProductsFound += products.length;

                for (const product of products) {
                    if (product.valid) {
                        try {
                            await this.broker.publish(Event.ProductFound, product);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            } while (this.paginator.next() && currentProductsFound > 0 && this.paginator.getNumberOfPages() >= this.paginator.getPage());
            console.log(`total products found: ${totalProductsFound}`);
        } catch (e) {
            console.error(e);
        }
    }
}