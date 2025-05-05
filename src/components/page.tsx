export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
  )
}

export function PageTitleBar({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className={'flex h-6 items-center'}>
          <div className={'text-muted-foreground'}>{description}</div>
        </div>
      </div>
      <div className="flex flex-row gap-2">{children}</div>
    </div>
  )
}
