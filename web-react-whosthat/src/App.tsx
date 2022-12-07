import "./style.css"

import { Route, Routes } from "react-router-dom"

import AreaCameraPage from "./pages/AreaCameraPage"
import AreaPage from "./pages/AreaPage"
import AreaReportPage from "./pages/AreaReportPage"
import AreaUserPage from "./pages/AreaUserPage"
import Landing from "./pages/Landing"

const App = () => {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<Landing />}
				/>
				<Route path="areas/:areaId">
					<Route
						index
						element={<AreaPage />}
					/>
					<Route
						path="reports/:reportId"
						element={<AreaReportPage />}
					/>
					<Route
						path="users/:userId"
						element={<AreaUserPage />}
					/>
					<Route
						path="cameras/:cameraId"
						element={<AreaCameraPage />}
					/>
				</Route>
			</Routes>
		</>
	)
}

export default App
