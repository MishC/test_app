type Props ={ 
    icon?: React.ReactNode;
    title:string; 
    description:string;
    action?: React.ReactNode;
    children: React.ReactNode;
 };
export function ContentLayout({ icon=null,title, description, action, children }: Props) {
  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
         <span className="flex"> {icon?<span className="text-2xl font-bold tracking-tight mb-2 mr-2">{icon}</span>
         :""} <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2></span>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {action}
      </header>
        {children}
    </>
  );
}
