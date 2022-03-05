import { Notifier } from "../Domain/Notifier";
import { PorductRepository } from "../Domain/ProductRepository";
import { Retail } from "../Domain/Retail";

export class ProductNotifier {
    constructor(
        private repository: PorductRepository,
        private notifier: Notifier
    ) { }

    async notify(productId: string, retailId: Retail, minPrice: number) {
        try {
            const product = await this.repository.find(productId, retailId, minPrice);
            if (product) {
                console.log(`notifying ${product.name}...`);
                await this.notifier.notify(product);
            }
        } catch (e) {
            console.error(e);
        }
    }
}