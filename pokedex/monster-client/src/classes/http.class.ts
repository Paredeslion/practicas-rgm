export class Http {
  async ajax<T>(
    method: string,
    url: string,
    headers?: HeadersInit,
    body?: string
  ): Promise<T> {
    const resp = await fetch(url, { method, headers, body });

    if (!resp.ok) throw new Error(resp.statusText);

    // Si es un DELETE (204 No Content), no intentamos leer JSON
    if (resp.status !== 204) {
      return (await resp.json()) as T;
    }

    return null as T; // Retorno seguro para void
  }

  get<T>(url: string): Promise<T> {
    return this.ajax<T>("GET", url);
  }

  post<T, U>(url: string, data: U): Promise<T> {
    return this.ajax<T>(
      "POST",
      url,
      { "Content-Type": "application/json" },
      JSON.stringify(data)
    );
  }

  delete<T>(url: string): Promise<T> {
    return this.ajax<T>("DELETE", url);
  }
}
