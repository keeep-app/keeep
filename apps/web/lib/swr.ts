import useNativeSWR from 'swr';

export function useSWR<T>(url: string): ReturnType<typeof useNativeSWR<T>> {
  return useNativeSWR<T>(url, async () => {
    const response = await fetch(url);
    return (await response.json()).data;
  });
}
