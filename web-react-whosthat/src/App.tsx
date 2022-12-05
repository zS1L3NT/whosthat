import "./style.css"

import { Route, Routes } from "react-router-dom"

import AreaPage from "./features/area/pages/AreaPage"
import Landing from "./features/landing/pages/Landing"

const App = () => {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<Landing />}
				/>
				<Route
					path="areas/:areaId"
					element={<AreaPage />}
				/>
			</Routes>
		</>
	)
}

export default App
