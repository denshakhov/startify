export async function api<TPayload = any>(path: string, payload?: TPayload): Promise<any> {
    const response = await fetch(process.env.REACT_APP_API_URL + path, {
        method: 'POST',
        headers: payload
            ? {
                  'Content-Type': 'application/json',
              }
            : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
    })

    if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`)
    }

    return response.status !== 204 ? response.json() : undefined
}

export function showFetchError(error: unknown) {
    alert(error)
}
