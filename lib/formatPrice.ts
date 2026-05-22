type Args = {
  price: number;
  currency?: string;
};

export function formatPrice({ price, currency="USD"}: Args) {
    //style "en-US"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}