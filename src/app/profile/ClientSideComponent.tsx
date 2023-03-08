'use client'

export default function Test2(props: React.PropsWithRef<{ data: string[] }>) {
    const { data } = props
    return (
        <>
            <h3>Client Side Component</h3>
            {data.map((m, i) => (
                <span key={i}> {m} </span>
            ))}
        </>
    )
}
