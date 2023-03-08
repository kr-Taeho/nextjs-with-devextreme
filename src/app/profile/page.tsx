import ClientSideComponent from './ClientSideComponent'

async function getData(): Promise<string[]> {
    return ['Server', 'Data', 'Test']
}

export default async function Page() {
    const data = await getData()
    return (
        <>
            <h1>Profile Page...</h1>

            <ServerSideComponent data={data} />

            <ClientSideComponent data={data} />
        </>
    )
}

function ServerSideComponent(props: React.PropsWithRef<{ data: string[] }>) {
    const { data } = props
    return (
        <>
            <h3>Server Side Component</h3>
            {data.map((m, i) => (
                <span key={i}> {m} </span>
            ))}
        </>
    )
}
