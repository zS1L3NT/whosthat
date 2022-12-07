import { useDebugValue, useEffect, useState } from "react"

const useRefresh = <T>(refresh: () => Promise<T>, dependencies: any[] = []): T | null => {
	const [data, setData] = useState<T | null>(null)

	useDebugValue(data)

	useEffect(() => {
		refresh().then(setData)
		const interval = setInterval(() => {
			refresh().then(setData)
		}, 3000)

		return () => {
			clearInterval(interval)
		}
	}, [...dependencies])

	return data
}

export default useRefresh
