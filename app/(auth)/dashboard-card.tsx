import {Card, CardContent, CardHeader,CardTitle} from "@/components/ui/card"

export function DashboardCard(){
    return (
        <Card>
            <CardHeader className="flex flex-row items-end justify-between pb-3">
                <CardTitle className="text-lg font-normal">Label</CardTitle>
                Icon
                </CardHeader>
                <CardContent className="mt-2"><div className="text-3xl font-semibold">Value</div></CardContent></Card>
    )
}