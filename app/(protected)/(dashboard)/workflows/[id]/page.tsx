

// gets the workflow if and displays it


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return(
    <div>{id}</div>
  )

}