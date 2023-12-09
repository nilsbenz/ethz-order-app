import { Event, Order, OrderItem } from "@order-app/types";

export function getOutputCategories(event: Event, items: OrderItem[]) {
  return Array.from(
    new Set(
      items
        .map((i) => {
          const article = event.articles.find((a) => a.id === i.articleId);
          if (!article) {
            return null;
          }
          if (article.customOutput) {
            return article.customOutput;
          }
          const category = event.articleCategories.find(
            (c) => c.id === article.category
          );
          if (!category) {
            return null;
          }
          return category.output;
        })
        .filter(Boolean) as string[]
    )
  );
}

export function getFilteredOrder(
  event: Event,
  order: Order,
  outputCategories: string[]
): Order {
  return {
    ...order,
    items: order.items.filter((item) => {
      const article = event.articles.find((a) => a.id === item.articleId);
      if (!article) {
        return false;
      }
      if (article.customOutput) {
        return outputCategories.includes(article.customOutput);
      }
      const category = event.articleCategories.find(
        (c) => c.id === article.category
      );
      return category ? outputCategories.includes(category?.output) : false;
    }),
  };
}
