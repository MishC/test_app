type Props ={ 
    title:string; description:string;
    action?: React.ReactNode;children: React.ReactNode;
 };
export function ContentLayout({ title, description, action, children }: Props) {
  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {action}
      </header>
        {children}
    </>
  );
}
