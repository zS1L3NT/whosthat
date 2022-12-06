import "./style.css"

import { Route, Routes } from "react-router-dom"

import AreaPage from "./pages/AreaPage"
import Landing from "./pages/Landing"

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
