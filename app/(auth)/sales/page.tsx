import { ContentLayout } from "../content-layout";
import { SalesTable } from "./sales-table";
import { columns, Payment } from "./columns"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      customImage: "https://avatars.githubusercontent.com/u/12345678?v=4",
      status: "success",
      productName: "Product 1",
      customerName: "John Doe",
      customerLogo: "https://avatars.githubusercontent.com/u/12345678?v=4",
      customerEmail: "",
      date: "2024-01-01",
      price: 100.00,
    },
    // ...
  ]
}

export default async function Sales(){
      const data = await getData()

    return (
    <ContentLayout title="Sales" description="View all sales for your online store" >
        <div>
        <SalesTable columns={columns} data={data}    />
        </div>
    </ContentLayout>)

}


