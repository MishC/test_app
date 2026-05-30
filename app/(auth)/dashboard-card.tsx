import {Card, CardContent, CardHeader,CardTitle} from "@/components/ui/card"
type Props={
    label:string;
    value:string|number;
    icon:React.ReactNode
}
export function DashboardCard({label, icon, value}:Props){
    return (
        <Card>
            <CardHeader className="flex flex-row items-end justify-between pb-3">
                <CardTitle className="text-lg font-normal">{label}</CardTitle>
                {icon}
                </CardHeader>
                <CardContent className="mt-2"><div className="text-3xl font-semibold">{value}</div></CardContent></Card>
    )
}