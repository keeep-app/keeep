import useNativeSWR from 'swr';

export function useSWR<T>(url: string): ReturnType<typeof useNativeSWR<T>> {
  return useNativeSWR<T>(url, async () => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    });
    return (await response.json()).data;
  });
}
