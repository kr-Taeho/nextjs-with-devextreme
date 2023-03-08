export const api = {
    refresh: () => {},
    call: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        return fetch(input, init)
    },
}
