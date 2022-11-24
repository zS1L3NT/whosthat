type Location = {
	latitude: number
	longitude: number
}

const toRadians = (value: number) => {
	return (value * Math.PI) / 180
}

const distancediff = (l1: Location, l2: Location) => {
	const R = 6371.071
	const rlat1 = toRadians(l1.latitude)
	const rlat2 = toRadians(l2.latitude)
	const difflat = rlat2 - rlat1
	const difflon = toRadians(l2.longitude - l1.longitude)
	return (
		2 *
		R *
		Math.asin(
			Math.sqrt(
				Math.sin(difflat / 2) * Math.sin(difflat / 2) +
					Math.cos(rlat1) *
						Math.cos(rlat2) *
						Math.sin(difflon / 2) *
						Math.sin(difflon / 2)
			)
		)
	)
}

export default distancediff
